"use client";
import { Collection, CItem, useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { useShallow } from "zustand/react/shallow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { TrashIcon } from "@radix-ui/react-icons";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { useCallback, useEffect, useRef, useState, MouseEvent } from "react";
import { Input } from "@/components/ui/input";

type EditableTextProps = {
  value: string;
  onChange?: (value: string) => void;
  isMultiline?: boolean;
  isSecret?: boolean;
  placeholder?: string;
};
function EditableText(props: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    //if mouse is clicked on the text, it will change to editable
    //if mouse is clicked outside the text, it will change to non-editable
  }, []);

  const onClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (divRef.current?.contains(e.target as Node)) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, []);
  const initialRef = useRef(props.value);

  useEffect(() => {
    if (isEditing) {
      divRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <span className="flex-1 w-0 flex">
      <span
        spellCheck={false}
        suppressContentEditableWarning
        onClick={onClick}
        ref={divRef}
        contentEditable={isEditing}
        className={` edit-text ${
          isEditing
            ? "whitespace-pre-wrap break-words"
            : "text-nowrap overflow-hidden "
        }   w-full border border-transparent p-1 box-border focus:border focus:border-slate-300 focus:outline-none   `}
        onInput={(e) => props.onChange?.(e.currentTarget.textContent || "")}
        onKeyDown={(e) => {
          console.log(e.key);
          //if shift+enter is pressed, it will add a new line

          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setIsEditing(false);
          }
        }}
        onBlur={() => setIsEditing(false)}
        data-placeholder={props.placeholder || "Name"}
      >
        {initialRef.current}
      </span>
    </span>
  );
}

function EditableText2({
  value,
  onChange,
  isMultiline,
  isSecret,
  placeholder,
}: EditableTextProps) {
  return <Input value={value} onChange={(e) => onChange?.(e.target.value)} />;
}

export default function () {
  const { collections, addCollection } = useAppStore(
    useShallow((state) => ({
      collections: state.collections,
      addCollection: state.addCollection,
    }))
  );

  const [value, setValue] = useState("hello");

  return (
    <div className="p-3 flex flex-col gap-2 w-[400px] mx-auto">
      <div>
        <Button onClick={() => addCollection("New Collection")}>
          Add Collection
        </Button>
      </div>
      <div>
        <Accordion type="multiple" className="w-full">
          {collections.map((collection) => (
            <CollectionView key={collection.id} collection={collection} />
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function CollectionView({ collection }: { collection: Collection }) {
  const { addItem, deleteCollection, updateCollection } = useAppStore(
    useShallow((state) => ({
      addItem: state.addItem,
      deleteCollection: state.deleteCollection,
      updateCollection: state.updateCollection,
    }))
  );
  return (
    <AccordionItem value={collection.id}>
      <AccordionHeader className="flex items-center justify-between">
        <EditableText
          value={collection.name}
          onChange={(s) => {
            updateCollection(collection.id, s);
          }}
        />

        <div className="flex items-center gap-2">
          <TrashIcon />
          <AccordionTrigger />
        </div>
      </AccordionHeader>

      <AccordionContent>
        <div className="flex flex-col space-y-2">
          {collection.items.map((item) => (
            <ItemView key={item.id} item={item} cid={collection.id} />
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              addItem(collection.id, "New key", Date.now().toString())
            }
          >
            New Item
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ItemView({ item, cid }: { item: CItem; cid: string }) {
  const {} = useAppStore(
    useShallow((state) => ({
      addItem: state.addItem,
      deleteCollection: state.deleteCollection,
      updateCollection: state.updateCollection,
    }))
  );
  return (
    <div className="border flex w-full">
      <div className="flex items-center justify-between w-full">
        <EditableText value={item.key} />
        <EditableText value={item.value} />
      </div>
      <div className="flex items-center justify-between px-2 gap-1">
        <TrashIcon />
        <TrashIcon />
      </div>
    </div>
  );
}
