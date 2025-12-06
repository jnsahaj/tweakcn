import { create } from 'zustand';

interface ActionsStateProps {
  _handleSaveClickRef: (() => void) | null;
  setHandleSaveClick: (handler: () => void) => void;
  triggerSaveTheme: () => void;

  _setCodePanelOpenRef: ((open: boolean) => void) | null;
  setSetCodePanelOpen: (handler: (open: boolean) => void) => void;
  triggerCodePanelOpen: () => void; 
  
  _handleResetClickRef: (() => void) | null;
  setHandleRestClick: (handler: () => void) => void;
  triggerResetTheme: () => void;
}

export const useActionsStore = create<ActionsStateProps>((set, get) => ({
  _handleSaveClickRef: null,
  setHandleSaveClick: (handler) => { 
    set({ _handleSaveClickRef: handler }); 
  },
  triggerSaveTheme: () => {
    const handler = get()._handleSaveClickRef;
    if (handler) { 
      handler(); 
    } else { 
      console.warn("Save handler not set."); 
    }
  },

  _setCodePanelOpenRef: null,
  setSetCodePanelOpen: (handler) => { 
    set({ _setCodePanelOpenRef: handler }); 
  },
  triggerCodePanelOpen: () => {
    const handler = get()._setCodePanelOpenRef;
    if (handler) { 
      handler(true); 
    } else { 
      console.warn("Code Panel handler not set."); 
    }
  },

  _handleResetClickRef: null,
  setHandleRestClick: (handler) =>  {
    set({_handleResetClickRef: handler});
  },
  triggerResetTheme: () => {
    const handler = get()._handleResetClickRef;
    if(handler){
      handler();
    }else{
      console.warn("Reset handler not set")
    }
  },
}));