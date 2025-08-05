"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils'; 
import { ScrollArea } from '@/components/ui/scroll-area'; 

interface KeyboardShortcutsOverlayProps {
  children: React.ReactNode;
}

const KeyboardShortcutsOverlay: React.FC<KeyboardShortcutsOverlayProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null); 

  const shortcuts = [
    {
      category: "EDITING",
      items: [
        { action: "Apply random theme", keys: ["Space"] },
        { action: "Undo", keys: ["Ctrl", "Z"] },
        { action: "Redo", keys: ["Ctrl", "Y"] },
        { action: "Reset to current preset", keys: ["Ctrl", "R"] },
        { action: "Save theme", keys: ["Ctrl", "S"] },
      ]
    },
    {
      category: "NAVIGATION",
      items: [
        { action: "Next theme", keys: ["Ctrl", "→"] },
        { action: "Previous theme", keys: ["Ctrl", "←"] },
        { action: "Open AI tab", fun: () => console.log("Open AI Tab (Ctrl+Shift+O)"), keys: ["Ctrl", "Shift", "O"] },
        { action: "Toggle code panel", keys: ["Ctrl", "B"] },
      ]
    },
    {
      category: "COPY",
      items: [
        { action: "Copy theme CSS", keys: ["Ctrl", "Shift", "C"] },
        { action: "Copy registry command", keys: ["Ctrl", "Alt", "C"] },
      ]
    },
    {
      category: "HELP",
      items: [
        { action: "Show/hide shortcuts", keys: ["Ctrl", "/"] },
      ]
    }
  ];

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'Slash') {
        event.preventDefault();
        setIsVisible(prev => !prev); 
        return;
      }


      if (event.code === 'Escape' && isVisible) {
        event.preventDefault();
        handleClose();
        return;
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isVisible && overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, handleClose]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const KeyBadge: React.FC<{ keyName: string; className?: string }> = ({ keyName, className }) => (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-semibold bg-secondary text-secondary-foreground border border-secondary-foreground/20 rounded-md shadow-sm",
        "select-none",
        className
      )}
    >
      {keyName}
    </kbd>
  );

  return (
    <>
      {children}
      {isVisible && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in-0 duration-200"
          aria-modal="true"
          role="dialog"
        >
          <div
            ref={overlayRef}
            className="bg-card rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-border
                       transform transition-all animate-in zoom-in-95 data-[state=open]:slide-in-from-bottom-2 duration-300 ease-out"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-md flex items-center justify-center font-bold text-lg">
                  ⌘
                </div>
                <h2 className="text-xl font-semibold text-foreground">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <ScrollArea className="flex rounded-md flex-col h-full p-6">
              <p className="text-muted-foreground text-sm mb-6">
                Speed up your theme editing workflow with these keyboard shortcuts.
              </p>

              <div className="space-y-8">
                {shortcuts.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                      {category.category}
                    </h3>
                    <div className="space-y-3">
                      {category.items.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between group">
                          <span className="text-foreground text-sm font-medium">
                            {shortcut.action}
                          </span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <React.Fragment key={keyIndex}>
                                <KeyBadge keyName={key} />
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="text-muted-foreground text-xs font-semibold mx-0.5">+</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsOverlay;