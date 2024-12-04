import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";
import { useShallow } from "zustand/react/shallow";

// import { useShallow } from "zustand/react/shallow";
export type Collection = {
  id: string;
  name: string;
  items: CItem[];
  createdAt: Date;
  updatedAt: Date;
  //local
  isExpanded: boolean;
  //detect changes
  //_isChanged:boolean //if name or any child changed
  _name?: string;
  isDeleted: boolean;
  _isDeleted?: boolean;
};

export type CItem = {
  id: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
  //local
  //detect changes
  // _isChanged: boolean;
  _key?: string;
  _value?: string;
  _isDeleted?: boolean;
  isDeleted: boolean;
};

type State = {
  collections: Collection[];
  isConfirmDelete: boolean;
  isAutoSaveOn: boolean;
  isShowDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
type Actions = {
  //collection
  addCollection: (name: string) => void;
  deleteCollection: (id: string) => void;
  updateCollection: (id: string, name: string) => void;
  //items
  // getItem: (collectionId: string, id: string) => Item | undefined;
  addItem: (collectionId: string, key: string, value: string) => void;
  deleteItem: (collectionId: string, id: string) => void;
  updateItem: (
    collectionId: string,
    id: string,
    item: Partial<Pick<CItem, "key" | "value">>
  ) => void;
  //utils
  loadFromJsonString: (data: string) => void;
  mergeChanges: () => void;
  getUploadData: () => ServerData;
  getChangeCount: () => number;
  //settings
  setConfirmDelete: (isConfirm: boolean) => void;
  setIsAutoSaveOn: (value: boolean) => void;
  setIsShowDelete: (value: boolean) => void;
};

type Setter = (updater: (draft: State & Actions) => any | void) => void;
type Getter = () => State & Actions;
type ReturnType<T extends keyof Actions> = Pick<Actions, T>;
type ServerData = {
  collections: (Omit<Collection, "_originalName" | "items"> & {
    items: Omit<CItem, "_originalkey" | "_originalvalue">[];
  })[];
  //settings
  isAutoSaveOn: boolean;
  isConfirmDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
};
const utilsActions = (
  set: Setter,
  get: Getter
): ReturnType<
  "loadFromJsonString" | "mergeChanges" | "getUploadData" | "getChangeCount"
> => {
  return {
    loadFromJsonString(dataString) {
      const data = JSON.parse(dataString) as ServerData;

      set((draft) => {
        draft.collections = data.collections;
        draft.isAutoSaveOn = data.isAutoSaveOn;
        draft.isConfirmDelete = data.isConfirmDelete;
        draft.createdAt = data.createdAt;
        draft.updatedAt = data.updatedAt;
      });
    },
    getUploadData: () => {
      const {
        collections,
        isAutoSaveOn,
        isConfirmDelete,
        createdAt,
        updatedAt,
      } = get();
      // remove local fields
      const stateCopy = JSON.parse(
        JSON.stringify({
          collections: collections.map(({ _name, _isDeleted, ...c }) => ({
            ...c,
            items: c.items.map(({ _key, _value, _isDeleted, ...item }) => ({
              ...item,
            })),
          })),
          isAutoSaveOn,
          isConfirmDelete,
          createdAt,
          updatedAt,
        })
      );
      return stateCopy as ServerData;
    },
    getChangeCount() {
      let count = 0;
      get().collections.map((c) => {
        if (c._name != c.name) count++;
        if (c._isDeleted != c.isDeleted) count++;
        c.items = c.items.map((r) => {
          if (r._key != r.key) count++;
          if (r._value != r.value) count++;
          if (r.isDeleted != r._isDeleted) count++;
          return r;
        });
        return c;
      });
      return count;
    },
    mergeChanges: () => {
      //org = current for all ,remove _deleted
      set((d) => {
        d.collections.map((c) => {
          if (c._name != c.name) {
            c._name = c.name;
            console.log("Collection " + c.name);
          }
          if (c._isDeleted != c.isDeleted) {
            c._isDeleted = c.isDeleted;
          }
          c.items = c.items.map((r) => {
            if (r._key != r.key) {
              r._key = r.key;
              console.log(`Key ${c.name}:${r.key}`);
            }
            if (r._value != r.value) {
              r._value = r.value;
              console.log(`Value ${c.name}:${r.value}`);
            }
            if (r.isDeleted != r._isDeleted) {
              r._isDeleted = r._isDeleted;
            }
            return r;
          });
          return c;
        });
      });
    },
  };
};

const settingActions = (
  set: Setter,
  get: Getter
): ReturnType<"setIsShowDelete" | "setConfirmDelete" | "setIsAutoSaveOn"> => {
  return {
    setConfirmDelete(isConfirm) {
      set((d) => {
        d.isConfirmDelete = isConfirm;
      });
    },
    setIsAutoSaveOn(value) {
      set((d) => {
        d.isAutoSaveOn = value;
      });
    },
    setIsShowDelete(value) {
      set((d) => {
        d.isShowDeleted = value;
      });
    },
  };
};

export const useAppStore = create<State & Actions>()(
  immer((set, get) => ({
    collections: [],
    isConfirmDelete: true,
    isAutoSaveOn: true,
    isShowDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    addCollection: (name) => {
      set((state) => {
        state.collections.push({
          id: nanoid(),
          name,
          items: [],
          isExpanded: false,
          isDeleted: false,
          updatedAt: new Date(),
          createdAt: new Date(),
        });
      });
    },
    deleteCollection: (id) => {
      set((state) => {
        const index = state.collections.findIndex((c) => c.id === id);
        state.collections[index].isDeleted = true;
        // make all items deletd
        state.collections[index].items.forEach((item) => {
          item.isDeleted = true;
        });
      });
    },
    updateCollection: (id, name) => {
      set((state) => {
        const index = state.collections.findIndex((c) => c.id === id);
        if (index == -1) return;
        state.collections[index].name = name;
        state.collections[index].updatedAt = new Date();
      });
    },
    //items
    addItem: (collectionId, key, value) => {
      set((state) => {
        const collectionIndex = state.collections.findIndex(
          (c) => c.id === collectionId
        );
        if (collectionIndex != -1) {
          state.collections[collectionIndex].items.push({
            id: nanoid(),
            key,
            value,
            isDeleted: false,
            updatedAt: new Date(),
            createdAt: new Date(),
          });
        }
      });
    },
    deleteItem: (collectionId, id) => {
      set((state) => {
        const collectionIndex = state.collections.findIndex(
          (c) => c.id === collectionId
        );
        if (collectionIndex != -1) {
          const itemIndex = state.collections[collectionIndex].items.findIndex(
            (i) => i.id === id
          );
          if (itemIndex != -1) {
            state.collections[collectionIndex].items[itemIndex].isDeleted =
              true;
          }
        }
      });
    },
    updateItem: (collectionId, id, item) => {
      set((state) => {
        const collectionIndex = state.collections.findIndex(
          (c) => c.id === collectionId
        );
        if (collectionIndex != -1) {
          const itemIndex = state.collections[collectionIndex].items.findIndex(
            (i) => i.id === id
          );
          if (itemIndex != -1) {
            state.collections[collectionIndex].items[itemIndex] = {
              ...state.collections[collectionIndex].items[itemIndex],
              ...item,
              updatedAt: new Date(),
            };
          }
        }
      });
    },
    ...utilsActions(set, get),
    ...settingActions(set, get),
  }))
);

export function useShallowAppStore<U>(s: (state: State & Actions) => U) {
  return useAppStore(useShallow(s));
}

function genDemoData() {
  //gen 5 demo collections
  for (let i = 0; i < 5; i++) {
    useAppStore.getState().addCollection(`Collection ${i}`);
  }
  //gen 5 demo items for each collection
  useAppStore.getState().collections.forEach((c) => {
    for (let i = 0; i < 5; i++) {
      useAppStore.getState().addItem(c.id, `key ${i}`, `value ${i}`);
    }
  });
}
genDemoData();

// export const useCollection = (id: string) => {
//   const { collection } = useAppStore(
//     useShallow((state) => ({
//       collection: state.collections.find((c) => c.id === id),
//     })),
//   );
//   if (!collection) throw new Error(`Collection with id ${id} not found`);
//   return {
//     id: collection.id,
//     name: collection.name,
//     items: collection.items,
//     isExpanded: collection._isExpanded,
//     isDeleted: collection._isDeleted,
//     isNew: collection._isNew,
//     isChanged: collection._originalName !== collection.name,
//   };
// };
// export type Collection = ReturnType<typeof useCollection>;

// export const useItem = (collectionId: string, id: string) => {
//   const { item } = useAppStore(
//     useShallow((state) => ({
//       item: state.getItem(collectionId, id),
//     })),
//   );
//   if (!item) throw new Error(`Item with id ${id} not found`);
//   return {
//     key: item.key,
//     value: item.value,
//     isDeleted: item._isDeleted,
//     isNew: item._isNew,
//     isChanged:
//       item._originalkey !== item.key || item._originalvalue !== item.value,
//     id: item.id,
//   };
// };
// export type Item = ReturnType<typeof useItem>;

//@ts-ignore
window.store = useAppStore.getState;

// useAppStore.subscribe((s) => {
//   console.log(s.collections);
// });
