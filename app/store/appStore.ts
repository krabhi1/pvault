import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { immer } from "zustand/middleware/immer";

export interface CredentialGroup {
  id: string;
  name: string;
  lastUpdated: string;
  children: Array<Credential>;
  open: boolean;
}

export interface Credential {
  id: string;
  key: string;
  value: string;
  type: "key-value" | "pass-code";
}

type State = {
  credentials: CredentialGroup[];
  updateTimes: number;
  page: "login" | "editor";
};

type Actions = {
  addGroup: () => void;
  deleteGroup: (groupId: string) => void;
  renameGroup: (groupId: string, name: string) => void;
  toggleGroup: (groupId: string) => void;
  addCredential: (groupId: string) => void;
  deleteCredential: (credentialId: string) => void;
  updateCredential: (
    credentialId: string,
    credential: Partial<Credential>
  ) => void;
  reset: () => void;
  changePage: (page: "login" | "editor") => void;
  setData: (data: CredentialGroup[]) => void;
  logout: () => void;
};

export const useCredentialStore = create<State & Actions>()(
  immer((set) => ({
    credentials: [],
    updateTimes: 0,
    page: "login",

    // add group
    addGroup: () =>
      set((state) => {
        state.updateTimes++;
        state.credentials.push({
          id: uuidv4(),
          name: "New Group",
          lastUpdated: new Date().toISOString(),
          children: [],
          open: false,
        });
      }),

    // delete
    deleteGroup: (groupId: string) => {
      set((state) => {
        state.updateTimes++;
        state.credentials = state.credentials.filter((g) => g.id !== groupId);
      });
    },

    // rename
    renameGroup: (groupId: string, name: string) => {
      set((state) => {
        state.updateTimes++;
        const group = state.credentials.find((g) => g.id === groupId);
        if (group) {
          group.name = name;
        }
      });
    },

    // toggle group
    toggleGroup: (groupId: string) => {
      set((state) => {
        const group = state.credentials.find((g) => g.id === groupId);
        if (group) {
          group.open = !group.open;
        }
      });
    },

    // add credential
    addCredential: (groupId: string) => {
      set((state) => {
        const group = state.credentials.find((g) => g.id === groupId);
        if (!group) return;
        group.children.push({
          id: uuidv4(),
          key: "",
          value: "",
          type: "key-value",
        });
        state.updateTimes++;
      });
    },

    // delete credential
    deleteCredential: (credentialId: string) => {
      set((state) => {
        for (const group of state.credentials) {
          group.children = group.children.filter((c) => c.id !== credentialId);
        }

        state.updateTimes++;
      });
    },

    // update credential
    updateCredential: (
      credentialId: string,
      credential: Partial<Credential>
    ) => {
      set((state) => {
        for (const group of state.credentials) {
          const c = group.children.find((c) => c.id === credentialId);
          if (c) {
            Object.assign(c, credential);
          }
        }

        state.updateTimes++;
      });
    },

    // reset update times
    reset: () => {
      set((state) => {
        state.updateTimes = 0;
      });
    },

    changePage: (page: "login" | "editor") => {
      set((state) => {
        state.page = page;
      });
    },

    setData: (data: CredentialGroup[]) => {
      set((state) => {
        state.credentials = data;
      });
    },

    logout: () => {
      set((state) => {
        state.page = "login";
        state.credentials = [];
        state.updateTimes = 0;
      });
    },
  }))
);
