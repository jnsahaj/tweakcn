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
  | "AI_GENERATE_FROM_PAGE"
  | "AI_GENERATE_FROM_CHAT"
  | "AI_GENERATE_FROM_CHAT_SUGGESTION"
  | "AI_GENERATE_EDIT"
  | "AI_GENERATE_RETRY"
  | "SAVE_THEME_FOR_SHARE"
  | "SAVE_THEME_FOR_V0"
  | "SAVE_THEME_FOR_PLAYGROUND"
  | "CHECKOUT"
  | "LIKE_THEME";

export interface PostLoginActionPayload<T = any> {
  type: PostLoginActionType;
  data?: T;
}

export type StoredPostLoginAction = PostLoginActionPayload | null;

type PostLoginHandler<T = any> = (data?: T) => void | Promise<void>;

const handlers: Map<PostLoginActionType, PostLoginHandler> = new Map();
const readyActions: Set<PostLoginActionType> = new Set();
let pendingAction: StoredPostLoginAction = null;

export function usePostLoginAction<T = any>(
  actionType: PostLoginActionType,
  handler: PostLoginHandler<T>
) {
  useEffect(() => {
    if (!actionType) return;

    handlers.set(actionType, handler as PostLoginHandler);
    readyActions.add(actionType);

    // If there's a pending action that matches this one, execute it
    if (pendingAction && pendingAction.type === actionType) {
      executePostLoginActionInternal(pendingAction);
      pendingAction = null;
    }

    return () => {
      const handler = handlers.get(actionType);
      if (handler) {
        handlers.delete(actionType);
        readyActions.delete(actionType);
      }
    };
  }, [actionType, handler]);
}

// Internal function to actually execute handlers
async function executePostLoginActionInternal(actionPayload: StoredPostLoginAction) {
  if (!actionPayload) return;

  const actionType = actionPayload.type;
  const actionData = actionPayload.data;
  const handler = handlers.get(actionType);

  if (handler) {
    await handler(actionData);
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
