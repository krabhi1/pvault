"use client";
import CollectionListView from "@/components/CollectionListView";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { dataRpc } from "@/configs/rpc";
import { useAuth } from "@/contexts/AuthContext";
import { usePromise } from "@/hooks/use-promise";
import { toast } from "@/hooks/use-toast";
import { decryptData } from "@/lib/crypt";
import { useAppStore } from "@/store/app-store";
import { PlusIcon } from "@radix-ui/react-icons";
import { ClientRequestOptions, InferRequestType } from "hono/client";
import router from "next/router";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
export default function Page() {
  const { isShowDeleted, collections, addCollection, load } = useAppStore(
    useShallow((s) => ({
      collections: s.collections,
      addCollection: s.addCollection,
      isShowDeleted: s.isShowDeleted,
      load: s.loadFromJsonString,
    }))
  );
  const { username, password } = useAuth();
  const { data, isLoading, error } = usePromise(
    async (
      arg: InferRequestType<typeof dataRpc.index.$get>,
      options: ClientRequestOptions
    ) => {
      const res = await dataRpc.index.$get(arg, options);
      const { data, error } = await res.json();
      if (res.ok) {
        return data;
      }
      throw new Error(error?.message);
    },
    {
      initial: [
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        },
      ],
    }
  );
  useEffect(() => {
    if (data) {
      //decrypt
      (async () => {
        const decrypted = await decryptData(password, data);
        console.log(decrypted);
        load(decrypted);
      })();
    }
    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  }, [data, error, load]);

  const filterCollections = collections.filter(
    (c) => isShowDeleted || !c.isDeleted
  );

  if (isLoading) {
    return "Loading...";
  }

  return (
    <div className="w-full h-full fixed flex flex-col">
      <Header />
      <Separator orientation="horizontal" className="my-2 mx-2 w-auto" />
      <div className="flex flex-1 flex-col items-center overflow-hidden px-6">
        {/* center */}
        <div className="flex gap-2  flex-1 flex-col overflow-hidden w-full max-w-screen-sm mb-4">
          <h1 className="text-xl text-gray-600 mt-5">
            Collections({filterCollections.length})
          </h1>
          <Button
            onClick={() => addCollection("New Collection")}
            variant={"secondary"}
          >
            <PlusIcon />
            New collection
          </Button>
          <ScrollArea className="flex-1 ">
            <CollectionListView collections={filterCollections} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
