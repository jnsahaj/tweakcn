export const FIGMA_CONSTANTS = {
  shadcraftUrl: "https://shadcraft.com?atp=tweakcn",
  previewUrl:
    "https://www.figma.com/design/MvIIEVqjGPyKbS000yPTEW/WORKING-%E2%80%A2-Shadcraft-Pro-%E2%80%A2-v1.0.0?node-id=7053-59081&t=WaB2vuyccN1cYCmM-11",
  designers: [
    { name: "Designer 1", avatar: "/figma-onboarding/avatar-1.png", fallback: "D1" },
    { name: "Designer 2", avatar: "/figma-onboarding/avatar-2.png", fallback: "D2" },
    { name: "Designer 3", avatar: "/figma-onboarding/avatar-3.png", fallback: "D3" },
    { name: "Designer 4", avatar: "/figma-onboarding/avatar-4.png", fallback: "D4" },
    { name: "Designer 5", avatar: "/figma-onboarding/avatar-5.png", fallback: "D5" },
    { name: "Designer 6", avatar: "/figma-onboarding/avatar-6.png", fallback: "D6" },
  ],
  steps: [
    {
      step: "Step 1",
      title: "Download the kit",
      description: "Get the comprehensive Shadcraft Figma UI kit",
    },
    {
      step: "Step 2",
      title: "Open the plugin",
      description: "Launch the tweakcn Figma plugin",
    },
    {
      step: "Step 3",
      title: "Apply your theme",
      description: "Transform components with your custom theme",
    },
  ],
  features: [
    "51 premium components",
    "44 responsive blocks",
    "Dark mode support",
    "1500+ vector icons",
  ],
};

export const redirectToShadcraft = () => {
  window.open(FIGMA_CONSTANTS.shadcraftUrl, "_blank");
};
