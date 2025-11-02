"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  SunIcon, 
  MoonIcon, 
  ContrastIcon, 
  EyeIcon, 
  TextIcon, 
  XIcon,
  SettingsIcon,
  ZapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export function AccessibilityToolbar() {
  const [mounted, setMounted] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Load saved preferences from localStorage
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '16');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedDyslexiaFont = localStorage.getItem('dyslexiaFont') === 'true';
    const savedIsMinimized = localStorage.getItem('accessibilityMinimized') === 'true';
    const savedIsVisible = localStorage.getItem('accessibilityVisible') !== 'false';
    
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
    setDarkMode(savedDarkMode);
    setDyslexiaFont(savedDyslexiaFont);
    setIsMinimized(savedIsMinimized);
    setIsVisible(savedIsVisible);
    
    // Apply initial settings
    if (savedHighContrast) {
      document.body.classList.add('high-contrast');
    }
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    if (savedDyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    }
    document.documentElement.style.fontSize = `${savedFontSize}px`;
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Save preferences to localStorage
    localStorage.setItem('highContrast', highContrast.toString());
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('dyslexiaFont', dyslexiaFont.toString());
    localStorage.setItem('accessibilityMinimized', isMinimized.toString());
    localStorage.setItem('accessibilityVisible', isVisible.toString());
    
    // Apply settings to the document
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
    
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [highContrast, fontSize, darkMode, dyslexiaFont, isMinimized, isVisible, mounted]);
  
  if (!mounted || !isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          onClick={() => setIsVisible(true)}
        >
          <SettingsIcon className="h-5 w-5 text-primary-foreground" />
        </Button>
      </motion.div>
    );
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className={`fixed bottom-4 right-4 z-50 bg-card border rounded-xl shadow-xl p-4 w-80 ${
            isMinimized ? 'w-auto h-auto p-2' : ''
          }`}
        >
          {isMinimized ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsMinimized(false)}
              >
                <SettingsIcon className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsVisible(false)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ZapIcon className="w-4 h-4 text-primary" />
                  Accessibility Options
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsMinimized(true)}
                  >
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsVisible(false)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex items-center gap-2">
                    <MoonIcon className="w-4 h-4" />
                    Dark Mode
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="flex items-center gap-2">
                    <ContrastIcon className="w-4 h-4" />
                    High Contrast
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dyslexia-font" className="flex items-center gap-2">
                    <TextIcon className="w-4 h-4" />
                    Dyslexia Font
                  </Label>
                  <Switch
                    id="dyslexia-font"
                    checked={dyslexiaFont}
                    onCheckedChange={setDyslexiaFont}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Font Size: {fontSize}px</Label>
                  <Slider
                    min={12}
                    max={24}
                    step={1}
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setFontSize(16)}
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setHighContrast(false);
                      setFontSize(16);
                      setDarkMode(false);
                      setDyslexiaFont(false);
                    }}
                  >
                    All Off
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}