import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionHeader } from "@radix-ui/react-accordion";
//icons
import { TrashIcon } from "@radix-ui/react-icons";
import { ReactProps } from "./utils";
import { Collection } from "@/app/store/app-store";
import { cn } from "@/lib/utils";
import EditText from "./EditText";
import RecordView from "./RecordView";

export type CollectionViewProps = ReactProps<{
  collection: Collection;
}>;
export default function CollectionView({
  collection,
  className,
}: CollectionViewProps) {
  return (
    <div className={cn("", className)}>
      <AccordionItem value={collection.id}>
        <AccordionHeader className="flex items-center justify-between">
          <EditText value={collection.name} />
          <div className="flex items-center gap-2">
            <TrashIcon />
            <AccordionTrigger />
          </div>
        </AccordionHeader>
        <AccordionContent>
          {collection.items.map((item) => (
            <RecordView key={item.id} item={item} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
