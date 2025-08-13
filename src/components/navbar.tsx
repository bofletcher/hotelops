'use client';

import { Building, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                  HotelOps
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Property Management
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Properties
              </a>
              <a 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Analytics
              </a>
              <a 
                href="#reports" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer opacity-50"
              >
                Reports
              </a>
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="opacity-50" disabled>
                Settings
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/"
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </a>
              <a
                href="/dashboard"
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </a>
              <a
                href="#reports"
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors cursor-pointer opacity-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Reports
              </a>
              <div className="border-t pt-3 mt-3">
                <Button variant="outline" size="sm" className="w-full opacity-50" disabled>
                  Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
