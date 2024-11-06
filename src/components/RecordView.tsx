import { CItem } from "@/app/store/app-store";
//icons from
import { TrashIcon, CopyIcon } from "@radix-ui/react-icons";
import EditText from "./EditText";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export type RecordViewProps = {
  item: CItem;
  className?: string;
};
export default function RecordView({ item, className }: RecordViewProps) {
  return (
    <div className={cn("flex w-full space-x-2 items-center", className)}>
      <div className="flex flex-1 space-x-2">
        <EditText className="flex-1 w-0" />
        <EditText isMultiline className="flex-1 w-0" />
      </div>
      <div className="flex space-x-1">
        <Button size={"sm"} variant="ghost" className="w-8 h-8 rounded-full">
          <CopyIcon />
        </Button>
        <Button variant="ghost" className="w-8 h-8 rounded-full">
          <TrashIcon color="red" />
        </Button>
      </div>
    </div>
  );
}
