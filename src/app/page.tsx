"use client";
import CollectionListView from "@/components/CollectionListView";
import Header from "@/components/Header";
import { useAppStore } from "./store/app-store";
import { useShallow } from "zustand/react/shallow";
export default function () {
  const { collections, addCollection } = useAppStore(
    useShallow((s) => ({
      collections: s.collections,
      addCollection: s.addCollection,
    }))
  );
  return (
    <div className="p-4 ">
      <Header />
      <div className="w-full border-b mt-2"></div>
      <h1 className="text-2xl text-gray-600 mt-5">
        Collections({collections.length})
      </h1>
      <CollectionListView
        onAddCollection={() => addCollection("New Collection")}
        className="mt-2"
        collections={collections}
      />
    </div>
  );
}
