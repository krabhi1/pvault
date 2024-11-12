import { CItem, useAppStore } from "@/app/store/app-store";
//icons from
import { TrashIcon, CopyIcon } from "@radix-ui/react-icons";
import EditText from "./EditText";
import { cn, copyTextToClipboard } from "@/lib/utils";
import { Button } from "./ui/button";
import { useShallow } from "zustand/react/shallow";

export type RecordViewProps = {
  item: CItem;
  className?: string;
  cid: string;
};
export default function RecordView({ item, className, cid }: RecordViewProps) {
  const { updateItem, deleteItem } = useAppStore(
    useShallow((s) => ({
      updateItem: s.updateItem,
      deleteItem: s.deleteItem,
    }))
  );
  const { id } = item;
  return (
    <div className={cn("flex w-full space-x-2 items-center", className)}>
      <div className="flex flex-1 space-x-2">
        <EditText
          onChange={(s) => updateItem(cid, id, { key: s })}
          value={item.key}
          className="flex-1 w-0"
        />
        <EditText
          onChange={(s) => updateItem(cid, id, { value: s })}
          value={item.value}
          isMultiline
          className="flex-1 w-0"
        />
      </div>
      <div className="flex space-x-1">
        <Button
          onClick={() => copyTextToClipboard(item.value)}
          size={"sm"}
          variant="ghost"
          className="w-8 h-8 rounded-full"
        >
          <CopyIcon />
        </Button>
        <Button
          onClick={() => deleteItem(cid, id)}
          variant="ghost"
          className="w-8 h-8 rounded-full"
        >
          <TrashIcon color="red" />
        </Button>
      </div>
    </div>
  );
}