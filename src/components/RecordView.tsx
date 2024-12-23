import { CItem, useAppStore, useShallowAppStore } from "@/store/app-store";
//icons from
import { TrashIcon, CopyIcon } from "@radix-ui/react-icons";
import EditText from "./EditText";
import { cn, copyTextToClipboard } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { useShallow } from "zustand/react/shallow";
import { getItemStatus, statusToColor } from "./utils";
import { memo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";

export type RecordViewProps = {
  item: CItem;
  className?: string;
  cid: string;
};
function RecordView({ item, className, cid }: RecordViewProps) {
  const { updateItem, deleteItem } = useAppStore(
    useShallow((s) => ({
      updateItem: s.updateItem,
      deleteItem: s.deleteItem,
    }))
  );
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { isConfirmDelete } = useShallowAppStore((s) => ({
    isConfirmDelete: s.isConfirmDelete,
  }));
  const { id } = item;
  const status = getItemStatus(item);
  const statusColor = statusToColor(status);
  const isNew = !item._key;
  return (
    <div
      className={cn(
        "flex w-full p-1 space-x-2 items-center bg-[#FAF9F8]",
        className
      )}
    >
      <div className="flex flex-1 space-x-2 items-center">
        <EditText
          onChange={(s) => updateItem(cid, id, { key: s })}
          value={item.key}
          className="flex-1 w-0"
          initialEditing={isNew}
        />
        <Separator orientation="vertical" className="h-[24px]" />
        <EditText
          onChange={(s) => updateItem(cid, id, { value: s })}
          value={item.value}
          isMultiline
          isSecret
          className="flex-1 w-0"
        />
      </div>
      <div className="flex items-center space-x-1">
        <span
          className={`w-2 h-2 rounded-full`}
          style={{ backgroundColor: statusColor }}
        ></span>
        <Button
          onClick={() => {
            copyTextToClipboard(item.value);
            const t = toast({
              title: "Clipboard",
              description: "Text copied to clipboard!",
            });
            setTimeout(() => {
              t.dismiss();
            }, 2000);
          }}
          size={"sm"}
          variant="ghost"
          className="w-8 h-8 rounded-full"
        >
          <CopyIcon />
        </Button>
        <Button
          onClick={() => {
            if (isConfirmDelete) setIsDeleteDialogOpen(true);
            else deleteItem(cid, item.id);
          }}
          variant="ghost"
          className="w-8 h-8 rounded-full"
        >
          <TrashIcon color="red" />
        </Button>
      </div>
      {/* collection delete dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Confirmation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              Record
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => deleteItem(cid, item.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default memo(RecordView);
