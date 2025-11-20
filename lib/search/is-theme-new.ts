import { ThemePreset } from "@/types/theme";

export const isThemeNew = (preset: ThemePreset) => {
    if (!preset.createdAt) return false;
    const createdAt = new Date(preset.createdAt);
    const timePeriod = new Date();
    timePeriod.setDate(timePeriod.getDate() - 5);
    return createdAt > timePeriod;
};