import { Collection } from "@/store/app-store";
import { Accordion } from "./ui/accordion";
import CollectionView from "./CollectionView";
import { ReactProps } from "./utils";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "./ui/card";
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
      className={cn("w-full gap-2 grid grid-cols-1 ", className)} //md:grid-cols-2
    >
      {collections
        .filter((o) => !o._isDeleted)
        .map((collection) => (
          <CollectionView
            className="border border-gray-200 p-2 "
            key={collection.id}
            collection={collection}
          />
        ))}
      <Button onClick={() => onAddCollection?.()} variant={"secondary"}>
        <PlusIcon />
        New collection
      </Button>
    </Accordion>
  );
}
