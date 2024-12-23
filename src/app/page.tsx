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
import { decrypt } from "@/common/crypt";
import { useAppStore } from "@/store/app-store";
import { PlusIcon } from "@radix-ui/react-icons";
import { ClientRequestOptions, InferRequestType } from "hono/client";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
export default function Page() {
  const { isShowDeleted, collections, addCollection, load, merge } =
    useAppStore(
      useShallow((s) => ({
        collections: s.collections,
        addCollection: s.addCollection,
        isShowDeleted: s.isShowDeleted,
        load: s.loadFromJsonString,
        merge: s.mergeChanges,
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
        const decrypted = await decrypt(data, password);
        console.log(decrypted);
        load(decrypted);
        // merge changes
        merge();
      })();
    }
    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  }, [data, error, load]);

  const [isUploading, setIsUploading] = useState(false);

  const filterCollections = collections.filter(
    (c) => isShowDeleted || !c.isDeleted
  );

  return (
    <div className="w-full h-full fixed flex flex-col">
      <Header onUpload={setIsUploading} />
      <Separator orientation="horizontal" className="my-2 mx-2 w-auto" />
      <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6">
        {/* center */}
        <div className=" flex gap-2  flex-1 flex-col overflow-hidden w-full max-w-screen-sm mb-4">
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
        {(isLoading || isUploading) && (
          <div className="text-black bg-white opacity-70 flex font-bold items-center justify-center absolute top-0 left-0 w-full h-full  bg-transparent">
            <Loader2Icon className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
