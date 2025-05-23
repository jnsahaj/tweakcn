import { useQueryState } from "nuqs";

const TABS = ["colors", "typography", "other"] as const;
type ControlTab = (typeof TABS)[number];

export const useControlsTabFromUrl = () => {
  const [tab, setTab] = useQueryState("tab", { defaultValue: TABS[0] });

  const handleSetTab = (tab: ControlTab) => {
    setTab(tab);
  };

  return { tab, handleSetTab };
};
