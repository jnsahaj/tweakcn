"use client"
import { useClient } from "@/hooks/use-client"
import { useActionsStore } from "@/store/action-store"
import { useEditorStore } from "@/store/editor-store"
import { useThemePresetStore } from "@/store/theme-preset-store"
import { usePreferencesStore } from "@/store/preferences-store"
import { defaultPresets } from "@/utils/theme-presets"
import { generateThemeCode } from "@/utils/theme-style-generator"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo } from "react"
import { usePostHog } from 'posthog-js/react'
import { useAIChatStore } from "@/store/ai-chat-store"
import { ThemePreset } from "@/types/theme"

export const ThemeHotKeyHandler = ({children}:{children:React.ReactNode}) => {
    const { themeState, applyThemePreset, undo, redo , resetToCurrentPreset } = useEditorStore()
    const {clearMessages} = useAIChatStore()
    const { colorFormat, tailwindVersion, packageManager } = usePreferencesStore()
    const router = useRouter()
    const availableThemes = useMemo(() => Object.keys(defaultPresets),[])
    const isClient = useClient()
    const presets = useThemePresetStore((store) => store.getAllPresets());
    const posthog = usePostHog()
    
    const {
      triggerSaveTheme, 
      triggerCodePanelOpen,
    } = useActionsStore()

    const copyThemeCSS = useCallback(async () => {
        if (!isClient) return
        
        try {
            const cssCode = generateThemeCode(themeState, colorFormat, tailwindVersion)
            
            if (!cssCode) {
                return
            }

            await navigator.clipboard.writeText(cssCode)

            if (posthog) {
                posthog.capture("COPY_CODE_HOTKEY", {
                    editorType: "theme",
                    preset: themeState.preset,
                    colorFormat,
                    tailwindVersion,
                })
            }
        } catch (error) {
            console.error("Error copying CSS:", error)
        }
    }, [isClient, themeState, colorFormat, tailwindVersion, triggerCodePanelOpen, posthog])

    const copyRegistryCommand = useCallback(async () => {
        if (!isClient) return

        try {
            const preset = themeState.preset ?? "default"

            const presetData = presets[preset]
            const isSavedPreset = presetData?.source === "SAVED"
            
            const url = isSavedPreset
                ? `https://tweakcn.com/r/themes/${preset}`
                : `https://tweakcn.com/r/themes/${preset}.json`

            let command = ""
            switch (packageManager) {
                case "pnpm":
                    command = `pnpm dlx shadcn@latest add ${url}`
                    break
                case "npm":
                    command = `npx shadcn@latest add ${url}`
                    break
                case "yarn":
                    command = `yarn dlx shadcn@latest add ${url}`
                    break
                case "bun":
                    command = `bunx shadcn@latest add ${url}`
                    break
                default:
                    command = `npx shadcn@latest add ${url}`
            }

            if (!command) {
                return
            }

            await navigator.clipboard.writeText(command)

            if (posthog) {
                posthog.capture("COPY_REGISTRY_COMMAND_HOTKEY", {
                    editorType: "theme",
                    preset: themeState.preset,
                    colorFormat,
                    tailwindVersion,
                })
            }

        } catch (error) {
            console.error("Error copying registry command:", error)
        }
    }, [isClient, themeState.preset, presets, packageManager, triggerCodePanelOpen, posthog, colorFormat, tailwindVersion])
     
    const allPresetNames = useMemo(() => ["default", ...Object.keys(presets)], [presets]);

    const sortAndFilterPresets = useCallback((allNames: string[], currentPresets: Record<string, ThemePreset>) => {
        const filteredList = allNames; 
        const isSavedTheme = (presetId: string) => currentPresets[presetId]?.source === "SAVED";
        const savedThemesList = filteredList.filter((name) => name !== "default" && isSavedTheme(name));
        const defaultThemesList = filteredList.filter((name) => !savedThemesList.includes(name));

        const sortThemesInternal = (list: string[]) => { 
            const defaultTheme = list.filter((name) => name === "default");
            const otherThemes = list
                .filter((name) => name !== "default")
                .sort((a, b) => {
                    const labelA = currentPresets[a]?.label || a;
                    const labelB = currentPresets[b]?.label || b;
                    return labelA.localeCompare(labelB);
                });
            return [...defaultTheme, ...otherThemes];
        };

        return [...sortThemesInternal(savedThemesList), ...sortThemesInternal(defaultThemesList)];
    }, []); 

    const availableThemesForHotkeyCycling = useMemo(() => {
        return sortAndFilterPresets(allPresetNames, presets);
    }, [allPresetNames, presets, sortAndFilterPresets]); 

    const currentThemeIndex = useMemo(
        () => availableThemesForHotkeyCycling.indexOf(themeState.preset || "default"),
        [availableThemesForHotkeyCycling, themeState.preset]
    );

    const cycleTheme = useCallback(
        (direction: "prev" | "next") => {
            if (availableThemesForHotkeyCycling.length === 0) {
                return;
            }
            let newIndex;
            if (direction === "next") {
                newIndex = (currentThemeIndex + 1) % availableThemesForHotkeyCycling.length;
            } else {
                newIndex = (currentThemeIndex - 1 + availableThemesForHotkeyCycling.length) % availableThemesForHotkeyCycling.length;
                if (newIndex < 0) { 
                    newIndex += availableThemesForHotkeyCycling.length;
                }
            }
            applyThemePreset(availableThemesForHotkeyCycling[newIndex]);
        },
        [currentThemeIndex, availableThemesForHotkeyCycling, applyThemePreset]
    );
    
    const applyRandomTheme = useCallback(() => {
        if(!isClient) return;
        
        const currentTheme = themeState.preset
        const otherThemes = availableThemes.filter(theme => theme != currentTheme)
        
        if(otherThemes.length > 0){
            const randomIndex = Math.floor(Math.random()* otherThemes.length)
            const randomTheme = otherThemes[randomIndex]
            applyThemePreset(randomTheme)
        }
    }, [isClient, themeState.preset, availableThemes, applyThemePreset])

    const handleReset = () => {
        resetToCurrentPreset()
        clearMessages()
    }

    useEffect(() => {
        if(!isClient) return;
        
        const handleGlobalKeyStroke = async (event: KeyboardEvent) => {
            
            if(!event.target || !(event.target instanceof HTMLElement)) return;

            if(event.target instanceof HTMLElement && 
              (event.target.tagName === "INPUT" || 
                event.target.tagName === "TEXTAREA" || 
                event.target.isContentEditable || 
                event.target.closest('[contenteditable="true"]')
               )) {
                return;
            }

            if(event.code === "Space"){
                event.preventDefault(); 
                applyRandomTheme();
            }

            if(event.ctrlKey && event.shiftKey && event.code === "KeyO"){
                event.preventDefault();
                router.push("https://tweakcn.com/editor/theme?tab=ai");
            }

            if(event.ctrlKey && event.code === "KeyZ" && !event.shiftKey){
                event.preventDefault()
                undo()
            }

            if(event.ctrlKey && event.code === "KeyY"){
                event.preventDefault()
                redo()
            }

            if(event.ctrlKey && event.code ==="ArrowRight"){
                event.preventDefault()
                cycleTheme("next")
            }

            if(event.ctrlKey && event.code === "ArrowLeft"){
                event.preventDefault()
                cycleTheme("prev")
            }

            if(event.ctrlKey && event.code === "KeyS"){
                event.preventDefault()
                triggerSaveTheme();
            }

            if(event.ctrlKey && event.code === "KeyB"){
                event.preventDefault()
                triggerCodePanelOpen()
            }

            if(event.ctrlKey && event.shiftKey && event.code === "KeyC"){
                event.preventDefault()
                try {
                    await copyThemeCSS()
                } catch (error) {
                    console.error("Error copying CSS:", error);
                }
            }

            if(event.ctrlKey && event.altKey && event.code === "KeyC"){
                event.preventDefault()
                try {
                    await copyRegistryCommand()
                } catch (error) {
                    console.error("Error copying theme command:", error);
                }
            }

            if(event.ctrlKey && event.code === "KeyR"){
                event.preventDefault()
                handleReset()
            }
        };
        window.addEventListener('keydown', handleGlobalKeyStroke);
        
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyStroke);
        };
    }, [
        isClient,
        applyRandomTheme,
        undo,
        redo,
        cycleTheme,
        triggerSaveTheme,
        triggerCodePanelOpen,
        copyThemeCSS,
        copyRegistryCommand,
    ]);

    return (
        <div>
            {children}
        </div>
    )
}