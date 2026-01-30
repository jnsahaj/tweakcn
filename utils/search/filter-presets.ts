import { ThemePreset } from "@/types/theme";

export const filterPresets = (presetNames: string[], presets: Record<string, ThemePreset>, search: string) => {
    const searchLower = search.toLowerCase();
    const filteredList =
        search.trim() === ""
            ? presetNames
            : presetNames.filter((name) => {
                if (name === "default") {
                    return "default".includes(searchLower);
                }
                const label = presets[name]?.label;
                return label ? label.toLowerCase().includes(searchLower) : false;
            });

    return filteredList;
};
