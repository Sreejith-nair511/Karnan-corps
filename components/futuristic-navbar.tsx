"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from 'next-intl';
import { 
  HomeIcon, 
  MapIcon, 
  TrophyIcon, 
  FileTextIcon, 
  UserIcon,
  MenuIcon,
  XIcon,
  SettingsIcon,
  ZapIcon,
  LeafIcon,
  AwardIcon,
  BarChartIcon,
  EyeIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

export function FuturisticNavbar() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/verification", label: t('verificationConsole'), icon: MapIcon },
    { href: "/citizen", label: t('citizenPortal'), icon: UserIcon },
    { href: "/transparency", label: t('transparency'), icon: FileTextIcon },
    { href: "/rewards", label: t('adminRewards'), icon: TrophyIcon },
    { href: "/solar-detection", label: "Solar Detection", icon: EyeIcon }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 py-2 shadow-lg" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <LeafIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              EcoInnovators
            </span>
            <div className="text-xs text-muted-foreground -mt-1">AI Solar Verification</div>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
                      isActive(item.href) 
                        ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary-foreground shadow-md" 
                        : "hover:bg-accent hover:shadow-md"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <LanguageSwitcher />
          </motion.div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 py-6 border-b">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <LeafIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    EcoInnovators
                  </span>
                  <div className="text-xs text-muted-foreground">AI Solar Verification</div>
                </div>
              </div>
              <nav className="flex flex-col gap-2 py-6 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 rounded-xl px-4 py-6 text-lg ${
                          isActive(item.href) 
                            ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary-foreground shadow-md" 
                            : "hover:shadow-md"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </nav>
              <div className="py-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Language</span>
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}