import { createContext, useCallback, useContext, useState } from "react";
import { Updater, useImmer } from "use-immer";

export type AppState = {
  page: "login" | "editor"|"change-password";
  password: string;
  username: string;
  moveTo: (page: AppState["page"]) => void;
  update: (callback: UpdateCallback) => void;
};
type UpdateType = Omit<AppState, "moveTo" | "update">;
type UpdateCallback = (draft: UpdateType) => void;

const AppContext = createContext<AppState | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

export function AppProvider(props: React.PropsWithChildren) {
  const [state, setState] = useImmer<UpdateType>({
    page: "login",
    username: "",
    password: "",
  });
  const moveTo = useCallback(
    (name: AppState["page"]) => {
      setState((draft) => {
        draft.page = name;
      });
    },
    [setState],
  );
  const update = useCallback(
    (callback: (draft: UpdateType) => void) => {
      setState((draft) => {
        callback(draft as any as UpdateType);
      });
    },
    [setState],
  );
  return (
    <AppContext.Provider value={{ ...state, moveTo, update }}>
      {props.children}
    </AppContext.Provider>
  );
}
