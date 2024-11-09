import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AccordionHeader } from "@radix-ui/react-accordion";
//icons
import { TrashIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { ReactProps } from "./utils";
import { Collection } from "@/app/store/app-store";
import { cn } from "@/lib/utils";
import EditText from "./EditText";
import RecordView from "./RecordView";
import { Button, buttonVariants } from "./ui/button";

export type CollectionViewProps = ReactProps<{
  collection: Collection;
}>;
export default function CollectionView({
  collection,
  className,
}: CollectionViewProps) {
  return (
    <AccordionItem
      className={cn("border-none", className)}
      value={collection.id}
    >
      <AccordionHeader className="flex items-center justify-between space-x-2 ">
        <EditText value={collection.name} />
        <div className="flex items-center space-x-1">
          <Button variant="ghost" className="w-8 h-8 rounded-full ">
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
        {collection.items.map((item) => (
          <RecordView key={item.id} item={item} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
