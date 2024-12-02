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
  _isExpanded: boolean;
  //detect changes
  //_isChanged:boolean //if name or any child changed
  _originalName?: string;
  _isDeleted: boolean;
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
  _originalkey?: string;
  _originalvalue?: string;
  _isDeleted: boolean;
};

type State = {
  collections: Collection[];
  isConfirmDelete: boolean;
  isAutoSaveOn: boolean;
  isShowDeleted: boolean;
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
  getUploadData: () => Collection[];
  //settings
  setConfirmDelete: (isConfirm: boolean) => void;
  setIsAutoSaveOn: (value: boolean) => void;
  setIsShowDelete: (value: boolean) => void;
};

type Setter = (updater: (draft: State & Actions) => any | void) => void;
type Getter = () => State & Actions;
type ReturnType<T extends keyof Actions> = Pick<Actions, T>;
const utilsActions = (
  set: Setter,
  get: Getter
): ReturnType<"loadFromJsonString" | "mergeChanges" | "getUploadData"> => {
  return {
    loadFromJsonString(data) {
      const json = JSON.parse(data) as Collection[];
      const collections = json.map((c) => {
        c._isDeleted = false;
        c._isExpanded = false;
        return c;
      });
      set((draft) => {
        draft.collections = collections;
      });
    },
    getUploadData: () => {
      //get all changed data
      //TODO remove (new and deleted)
      const changedCollections = (
        JSON.parse(JSON.stringify(get().collections)) as Collection[]
      )
        .map((c) => {
          //TODO remove unwanted property like _isExpanded
          c.items = c.items.filter(
            (r) =>
              r._isDeleted ||
              r.key != r._originalkey ||
              r.value != r._originalvalue
          );
          return c;
        })
        .filter(
          (c) =>
            c._isDeleted || c._originalName !== c.name || c.items.length != 0
        );
      return changedCollections;
    },
    mergeChanges: () => {
      //org = current for all ,remove _deleted
      set((d) => {
        d.collections.map((c) => {
          if (c._originalName != c.name) c._originalName = c.name;
          console.log(c._originalName, c.name);
          c.items = c.items.map((r) => {
            if (r._originalkey != r.key) r._originalkey = r.key;
            if (r._originalvalue != r.value) r._originalvalue = r.value;
            return r;
          });
          return c;
        });
        d.collections = d.collections.filter((c) => !c._isDeleted);
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
    addCollection: (name) => {
      set((state) => {
        state.collections.push({
          id: nanoid(),
          name,
          items: [],
          _isExpanded: false,
          _isDeleted: false,
          updatedAt: new Date(),
          createdAt: new Date(),
        });
      });
    },
    deleteCollection: (id) => {
      set((state) => {
        const index = state.collections.findIndex((c) => c.id === id);
        state.collections[index]._isDeleted = true;
        // make all items deletd
        state.collections[index].items.forEach((item) => {
          item._isDeleted = true;
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
            _isDeleted: false,
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
            state.collections[collectionIndex].items[itemIndex]._isDeleted =
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

///@ts-ignore
// window.store = useAppStore.getState;

// useAppStore.subscribe((s) => {
//   console.log(s.collections);
// });
