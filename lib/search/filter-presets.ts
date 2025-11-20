import { ThemePreset } from "@/types/theme";

export const filterPresets = (presetNames: string[], presets: Record<string, ThemePreset>, search: string) => {
    const filteredList =
        search.trim() === ""
            ? presetNames
            : presetNames.filter((name) => {
                if (name === "default") {
                    return "default".toLowerCase().includes(search.toLowerCase());
                }
                return presets[name]?.label?.toLowerCase().includes(search.toLowerCase());
            });

    return filteredList;
};
