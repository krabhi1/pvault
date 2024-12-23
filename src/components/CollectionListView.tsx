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
}>;
export default function CollectionListView({
  collections,
  className,
}: CollectionListViewProps) {
  return (
    <Accordion
      type="multiple"
      className={cn("w-full gap-2 grid grid-cols-1 ", className)} //md:grid-cols-2
    >
      {collections.map((collection) => (
        <CollectionView
          className="border border-gray-200 p-2 "
          key={collection.id}
          collection={collection}
        />
      ))}
    </Accordion>
  );
}
