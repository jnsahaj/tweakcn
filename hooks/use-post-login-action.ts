import { useEffect } from "react";

export type PostLoginAction = "SAVE_THEME" | null;
type PostLoginHandler = () => void | Promise<void>;

const handlers: Map<PostLoginAction, PostLoginHandler[]> = new Map();

export function usePostLoginAction(
  action: PostLoginAction,
  handler: PostLoginHandler
) {
  useEffect(() => {
    if (!action) return;

    if (!handlers.has(action)) {
      handlers.set(action, []);
    }
    handlers.get(action)!.push(handler);

    return () => {
      const actionHandlers = handlers.get(action);
      if (actionHandlers) {
        const index = actionHandlers.indexOf(handler);
        if (index > -1) {
          actionHandlers.splice(index, 1);
        }
      }
    };
  }, [action, handler]);
}

// This function should be called when a user successfully logs in
export async function executePostLoginAction(action: PostLoginAction) {
  if (!action) return;

  const actionHandlers = handlers.get(action);
  if (actionHandlers) {
    for (const handler of actionHandlers) {
      await handler();
    }
  }
}
