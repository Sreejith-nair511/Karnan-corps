"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Languages, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Get current locale from pathname
  const getCurrentLocale = () => {
    const pathParts = pathname.split('/');
    const locale = pathParts[1];
    return ['en', 'hi', 'ta', 'ml'].includes(locale) ? locale : 'en';
  };
  
  const [currentLocale, setCurrentLocale] = useState('en');
  
  useEffect(() => {
    setMounted(true);
    setCurrentLocale(getCurrentLocale());
  }, [pathname]);
  
  const handleLocaleChange = (newLocale: string) => {
    // Get the current path without the locale prefix
    const pathParts = pathname.split('/');
    let currentPath = pathParts.slice(2).join('/');
    
    // Handle root path case
    if (currentPath === '') {
      currentPath = '';
    }
    
    // Construct new path with the selected locale
    const newPath = newLocale === 'en' 
      ? `/${currentPath}` 
      : `/${newLocale}${currentPath ? `/${currentPath}` : ''}`;
      
    router.push(newPath);
    setIsOpen(false);
  };
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  ];
  
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];
  
  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="gap-2">
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">Language</span>
      </Button>
    );
  }
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <Languages className="h-4 w-4" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-12 z-50 w-48 rounded-xl border bg-background p-2 shadow-lg"
            >
              {languages.map((language) => (
                <Button
                  key={language.code}
                  variant="ghost"
                  className={`w-full justify-between px-3 py-2 h-auto text-left ${
                    currentLocale === language.code ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleLocaleChange(language.code)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                  {currentLocale === language.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}