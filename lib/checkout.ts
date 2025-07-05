import { useEditorStore } from "@/store/editor-store";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

export const openCheckout = async (link: string) => {
  const mode = useEditorStore.getState().themeState.currentMode;

  try {
    // This creates the checkout iframe and returns a Promise
    // that resolves when the checkout is fully loaded
    const checkout = await PolarEmbedCheckout.create(link, mode);

    // Now you can interact with the checkout instance
    return checkout;
  } catch (error) {
    console.error("Failed to open checkout", error);
  }
};
