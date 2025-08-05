export const FIGMA_CONSTANTS = {
  shadcraftUrl: "https://shadcraft.com?aff=6NjlYZ",
  previewUrl:
    "https://www.figma.com/design/J1e0cfCkDffMx6I0D0g5Nd/PREVIEW-%E2%80%A2-Shadcraft-%E2%80%A2-Beta-0.1.0?node-id=7050-2702&p=f&m=dev",
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
