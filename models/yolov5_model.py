"""
YOLOv5 model for solar panel detection
Based on the implementation from saizk/Deep-Learning-for-Solar-Panel-Recognition
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

class Conv(nn.Module):
    """Standard convolution block"""
    
    def __init__(self, c1, c2, k=1, s=1, p=None, g=1, act=True):
        super(Conv, self).__init__()
        self.conv = nn.Conv2d(c1, c2, k, s, autopad(k, p), groups=g, bias=False)
        self.bn = nn.BatchNorm2d(c2)
        self.act = nn.SiLU() if act is True else (act if isinstance(act, nn.Module) else nn.Identity())

    def forward(self, x):
        return self.act(self.bn(self.conv(x)))

    def fuseforward(self, x):
        return self.act(self.conv(x))


def autopad(k, p=None):
    """Pad to 'same'"""
    if p is None:
        p = k // 2 if isinstance(k, int) else [x // 2 for x in k]
    return p


class Bottleneck(nn.Module):
    """Standard bottleneck"""
    
    def __init__(self, c1, c2, shortcut=True, g=1, e=0.5):
        super(Bottleneck, self).__init__()
        c_ = int(c2 * e)
        self.cv1 = Conv(c1, c_, 1, 1)
        self.cv2 = Conv(c_, c2, 3, 1, g=g)
        self.add = shortcut and c1 == c2

    def forward(self, x):
        return x + self.cv2(self.cv1(x)) if self.add else self.cv2(self.cv1(x))


class C3(nn.Module):
    """CSP Bottleneck with 3 convolutions"""
    
    def __init__(self, c1, c2, n=1, shortcut=True, g=1, e=0.5):
        super(C3, self).__init__()
        c_ = int(c2 * e)
        self.cv1 = Conv(c1, c_, 1, 1)
        self.cv2 = Conv(c1, c_, 1, 1)
        self.cv3 = Conv(2 * c_, c2, 1)
        self.m = nn.Sequential(*[Bottleneck(c_, c_, shortcut, g, e=1.0) for _ in range(n)])

    def forward(self, x):
        return self.cv3(torch.cat((self.m(self.cv1(x)), self.cv2(x)), dim=1))


class SPPF(nn.Module):
    """Spatial Pyramid Pooling - Fast (SPPF) layer"""
    
    def __init__(self, c1, c2, k=5):
        super(SPPF, self).__init__()
        c_ = c1 // 2
        self.cv1 = Conv(c1, c_, 1, 1)
        self.cv2 = Conv(c_ * 4, c2, 1, 1)
        self.m = nn.MaxPool2d(kernel_size=k, stride=1, padding=k // 2)

    def forward(self, x):
        x = self.cv1(x)
        y1 = self.m(x)
        y2 = self.m(y1)
        y3 = self.m(y2)
        return self.cv2(torch.cat([x, y1, y2, y3], 1))


class Detect(nn.Module):
    """YOLOv5 Detect head"""
    
    def __init__(self, nc=80, anchors=(), ch=()):
        super(Detect, self).__init__()
        self.nc = nc  # number of classes
        self.no = nc + 5  # number of outputs per anchor
        self.nl = len(anchors)  # number of detection layers
        self.na = len(anchors[0]) // 2  # number of anchors
        self.grid = [torch.zeros(1)] * self.nl  # init grid
        a = torch.tensor(anchors).float().view(self.nl, -1, 2)
        self.register_buffer('anchors', a)  # shape(nl,na,2)
        self.register_buffer('anchor_grid', a.clone().view(self.nl, 1, -1, 1, 1, 2))  # shape(nl,1,na,1,1,2)
        self.m = nn.ModuleList(nn.Conv2d(x, self.no * self.na, 1) for x in ch)  # output conv

    def forward(self, x):
        z = []  # inference output
        for i in range(self.nl):
            x[i] = self.m[i](x[i])  # conv
            bs, _, ny, nx = x[i].shape  # x(bs,255,20,20) to x(bs,3,20,20,85)
            x[i] = x[i].view(bs, self.na, self.no, ny, nx).permute(0, 1, 3, 4, 2).contiguous()

            if not self.training:  # inference
                if self.grid[i].shape[2:4] != x[i].shape[2:4]:
                    self.grid[i] = self._make_grid(nx, ny).to(x[i].device)

                y = x[i].sigmoid()
                y[..., 0:2] = (y[..., 0:2] * 2. - 0.5 + self.grid[i]) * 8  # xy
                y[..., 2:4] = (y[..., 2:4] * 2) ** 2 * self.anchor_grid[i]  # wh
                z.append(y.view(bs, -1, self.no))

        return x if self.training else (torch.cat(z, 1), x)

    @staticmethod
    def _make_grid(nx=20, ny=20):
        y, x = torch.arange(ny), torch.arange(nx)
        return torch.stack(torch.meshgrid([x, y], indexing='ij')).view(2, -1).T.contiguous().view(1, 1, ny, nx, 2).float()


class YOLOv5(nn.Module):
    """YOLOv5 model"""
    
    def __init__(self, nc=1, anchors=[[10,13, 16,30, 33,23], [30,61, 62,45, 59,119], [116,90, 156,198, 373,326]]):
        super(YOLOv5, self).__init__()
        self.nc = nc  # number of classes
        self.anchors = anchors
        
        # Backbone
        self.conv1 = Conv(3, 64, 6, 2, 2)  # 0-P1/2
        self.conv2 = Conv(64, 128, 3, 2)  # 1-P2/4
        self.c3_1 = C3(128, 128, 3)
        self.conv3 = Conv(128, 256, 3, 2)  # 3-P3/8
        self.c3_2 = C3(256, 256, 6)
        self.conv4 = Conv(256, 512, 3, 2)  # 5-P4/16
        self.c3_3 = C3(512, 512, 9)
        self.conv5 = Conv(512, 1024, 3, 2)  # 7-P5/32
        self.c3_4 = C3(1024, 1024, 3)
        self.sppf = SPPF(1024, 1024, 5)
        
        # Head
        self.upsample1 = nn.Upsample(None, 2, 'nearest')
        self.c3_5 = C3(1024, 512, 3, False)
        self.upsample2 = nn.Upsample(None, 2, 'nearest')
        self.c3_6 = C3(512, 256, 3, False)
        self.conv6 = Conv(256, 256, 3, 2)
        self.c3_7 = C3(512, 512, 3, False)
        self.conv7 = Conv(512, 512, 3, 2)
        self.c3_8 = C3(1024, 1024, 3, False)
        
        # Detection layers
        self.detect = Detect(nc, anchors, [256, 512, 1024])

    def forward(self, x):
        # Backbone
        x1 = self.conv1(x)
        x2 = self.conv2(x1)
        x3 = self.c3_1(x2)
        x4 = self.conv3(x3)
        x5 = self.c3_2(x4)
        x6 = self.conv4(x5)
        x7 = self.c3_3(x6)
        x8 = self.conv5(x7)
        x9 = self.c3_4(x8)
        x10 = self.sppf(x9)
        
        # Head
        x11 = self.upsample1(x10)
        x12 = torch.cat([x11, x7], 1)
        x13 = self.c3_5(x12)
        x14 = self.upsample2(x13)
        x15 = torch.cat([x14, x5], 1)
        x16 = self.c3_6(x15)
        x17 = self.conv6(x16)
        x18 = torch.cat([x17, x13], 1)
        x19 = self.c3_7(x18)
        x20 = self.conv7(x19)
        x21 = torch.cat([x20, x10], 1)
        x22 = self.c3_8(x21)
        
        # Detection
        return self.detect([x16, x19, x22])