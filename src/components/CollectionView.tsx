import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AccordionHeader } from "@radix-ui/react-accordion";
//icons
import { TrashIcon, ChevronDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { getCollectionStatus, ReactProps, statusToColor } from "./utils";
import { Collection, useAppStore, useShallowAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import EditText from "./EditText";
import RecordView from "./RecordView";
import { Button, buttonVariants } from "./ui/button";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";

export type CollectionViewProps = ReactProps<{
  collection: Collection;
}>;

export default function CollectionView({
  collection,
  className,
}: CollectionViewProps) {
  const { addItem, deleteCollection, updateCollection, isShowDeleted } =
    useAppStore(
      useShallow((s) => ({
        addItem: s.addItem,
        deleteCollection: s.deleteCollection,
        updateCollection: s.updateCollection,
        isShowDeleted: s.isShowDeleted,
      }))
    );
  const { isConfirmDelete } = useShallowAppStore((s) => ({
    isConfirmDelete: s.isConfirmDelete,
  }));
  const [isCollDeleteDialogOpen, setIsCollDeleteDialogOpen] = useState(false);
  const status = getCollectionStatus(collection);
  const statusColor = statusToColor(status);

  const items = collection.items.filter(
    (item) => isShowDeleted || !item._isDeleted
  );

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
            onClick={() => {
              if (isConfirmDelete) setIsCollDeleteDialogOpen(true);
              else deleteCollection(collection.id);
            }}
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
        {items.map((item) => (
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
      {/* collection delete dialog */}
      <AlertDialog
        open={isCollDeleteDialogOpen}
        onOpenChange={setIsCollDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Confirmation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              collection
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => deleteCollection(collection.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccordionItem>
  );
}

// export function ConfirmCollectionDeleteDialog(props: { onDelete: () => void,open }) {
//   const [open, isOpen] = useState(true);
//   return (
//     <AlertDialog open={open} onOpenChange={} >
//       <AlertDialogTrigger asChild>
//         <Button variant="outline">Show Dialog</Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete your
//             account and remove your data from our servers.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel >Cancel</AlertDialogCancel>
//           <AlertDialogAction>Continue</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
