"use client"
import { useClient } from "@/hooks/use-client"
import { useEditorStore } from "@/store/editor-store"
import { defaultPresets } from "@/utils/theme-presets"
import { useEffect, useMemo } from "react"


export const ThemeHotKeyHandler = ({children}:{children:React.ReactNode}) => {

    const { themeState, applyThemePreset } = useEditorStore()
    
      const availableThemes = useMemo(() => Object.keys(defaultPresets),[])
      const isClient = useClient()
    
      const applyRandomTheme = () => {
    
        if(!isClient) return;
    
        const currentTheme = themeState.preset
        const otherThemes = availableThemes.filter(theme => theme != currentTheme)
    
        if(otherThemes.length > 0){
          const randomIndex = Math.floor(Math.random()* otherThemes.length)
          const randomTheme = otherThemes[randomIndex]
          applyThemePreset(randomTheme)
        }
      }

      useEffect(() => {
      
          if(!isClient) return;
      
          const handleKeySpaceStroke = (event: KeyboardEvent) => {
            if(!event.target || !(event.target instanceof HTMLElement)) return;
      
            if(event.code === "Space" && 
              event.target.tagName !== "INPUT" &&
              event.target.tagName !== "TEXTAREA" &&
               !event.target.isContentEditable &&
                !event.target.closest('[contenteditable="true"]')) {
              
              event.preventDefault(); 
              applyRandomTheme();
            }
          };
      
          window.addEventListener('keydown', handleKeySpaceStroke);
          
          
          return () => {
            window.removeEventListener('keydown', handleKeySpaceStroke);
          };
        }, [isClient, themeState.preset]);

    return (
        <div>
            {children}
        </div>
    )
}