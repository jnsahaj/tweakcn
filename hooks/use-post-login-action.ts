import { useEffect } from "react";

// Old PostLoginAction type commented out for reference
// export type PostLoginAction =
//   | "SAVE_THEME"
//   | "AI_GENERATE_FROM_DIALOG"
//   | "AI_GENERATE_FROM_CHAT"
//   | "SAVE_THEME_FOR_SHARE"
//   | null;

export type PostLoginActionType =
  | "SAVE_THEME"
  | "AI_GENERATE_FROM_DIALOG"
  | "AI_GENERATE_FROM_CHAT"
  | "SAVE_THEME_FOR_SHARE"
  | "LIKE_THEME";

export interface PostLoginActionPayload<T = any> {
  type: PostLoginActionType;
  data?: T;
}

export type StoredPostLoginAction = PostLoginActionPayload | null;

type PostLoginHandler<T = any> = (data?: T) => void | Promise<void>;

const handlers: Map<PostLoginActionType, PostLoginHandler[]> = new Map();
const readyActions: Set<PostLoginActionType> = new Set();
let pendingAction: StoredPostLoginAction = null;

export function usePostLoginAction<T = any>(
  actionType: PostLoginActionType,
  handler: PostLoginHandler<T>
) {
  useEffect(() => {
    if (!actionType) return;

    if (!handlers.has(actionType)) {
      handlers.set(actionType, []);
    }
    handlers.get(actionType)!.push(handler as PostLoginHandler); // Cast for simplicity, ensure T matches

    // Signal this action type is ready to be executed if needed
    readyActions.add(actionType);

    // If there's a pending action that matches this one, execute it
    if (pendingAction && pendingAction.type === actionType) {
      executePostLoginActionInternal(pendingAction);
      pendingAction = null;
    }

    return () => {
      const actionHandlers = handlers.get(actionType);
      if (actionHandlers) {
        const index = actionHandlers.indexOf(handler as PostLoginHandler);
        if (index > -1) {
          actionHandlers.splice(index, 1);
        }

        // If no more handlers for this action, remove from ready set
        if (actionHandlers.length === 0) {
          readyActions.delete(actionType);
        }
      }
    };
  }, [actionType, handler]);
}

// Internal function to actually execute handlers
async function executePostLoginActionInternal(actionPayload: StoredPostLoginAction) {
  if (!actionPayload) return;

  const actionType = actionPayload.type;
  const actionData = actionPayload.data;
  const actionHandlers = handlers.get(actionType);

  if (actionHandlers && actionHandlers.length > 0) {
    for (const handler of actionHandlers) {
      await handler(actionData);
    }
  }
}

// This function should be called when a user successfully logs in
export async function executePostLoginAction(actionPayload: StoredPostLoginAction) {
  if (!actionPayload) return;

  const actionType = actionPayload.type;

  // If handlers for this action type are ready, execute immediately
  if (readyActions.has(actionType)) {
    await executePostLoginActionInternal(actionPayload);
  } else {
    // Otherwise, set as pending to be executed when handlers are registered
    pendingAction = actionPayload;
  }
}
