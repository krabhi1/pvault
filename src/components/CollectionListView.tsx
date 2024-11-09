import { Collection } from "@/app/store/app-store";
import { Accordion } from "./ui/accordion";
import CollectionView from "./CollectionView";
import { ReactProps } from "./utils";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
export type CollectionListViewProps = ReactProps<{
  collections: Collection[];
  onAddCollection?: () => void;
}>;
export default function CollectionListView({
  collections,
  className,
  onAddCollection,
}: CollectionListViewProps) {
  return (
    <Accordion
      type="multiple"
      className={cn("w-full gap-2 grid grid-cols-1 md:grid-cols-2", className)}
    >
      {collections.map((collection) => (
        <CollectionView key={collection.id} collection={collection} />
      ))}
      <Button onClick={() => onAddCollection?.()} variant={"outline"}>
        <PlusIcon />
        New collection
      </Button>
    </Accordion>
  );
}
