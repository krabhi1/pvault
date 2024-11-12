import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AccordionHeader } from "@radix-ui/react-accordion";
//icons
import { TrashIcon, ChevronDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { getCollectionStatus, ReactProps, statusToColor } from "./utils";
import { Collection, useAppStore } from "@/app/store/app-store";
import { cn } from "@/lib/utils";
import EditText from "./EditText";
import RecordView from "./RecordView";
import { Button, buttonVariants } from "./ui/button";
import { useShallow } from "zustand/react/shallow";

export type CollectionViewProps = ReactProps<{
  collection: Collection;
}>;

export default function CollectionView({
  collection,
  className,
}: CollectionViewProps) {
  const { addItem, deleteCollection, updateCollection } = useAppStore(
    useShallow((s) => ({
      addItem: s.addItem,
      deleteCollection: s.deleteCollection,
      updateCollection: s.updateCollection,
    }))
  );
  const status = getCollectionStatus(collection);
  const statusColor = statusToColor(status);
  console.log(collection, status, statusColor);

  return (
    <AccordionItem className={cn("rounded", className)} value={collection.id}>
      <AccordionHeader className="flex items-center justify-between space-x-2  ">
        <EditText
          onChange={(s) => updateCollection(collection.id, s)}
          value={collection.name}
        />
        <div className="flex items-center space-x-1">
          <span
            className={`w-2 h-2 rounded-full`}
            style={{ backgroundColor: statusColor }}
          ></span>
          <Button
            onClick={() => deleteCollection(collection.id)}
            variant="ghost"
            className="w-8 h-8 rounded-full "
          >
            <TrashIcon color="red" />
          </Button>
          <AccordionTrigger
            className={
              buttonVariants({ variant: "ghost" }) + " w-8 h-8 rounded-full "
            }
          >
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          </AccordionTrigger>
        </div>
      </AccordionHeader>
      <AccordionContent className="space-y-2 p-1">
        {collection.items
          .filter((o) => !o._isDeleted)
          .map((item) => (
            <RecordView cid={collection.id} key={item.id} item={item} />
          ))}
        <Button
          onClick={() => addItem(collection.id, "key", "value")}
          variant={"secondary"}
          className="w-full"
        >
          <PlusIcon />
          New Item
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
