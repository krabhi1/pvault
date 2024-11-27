"use client";
import Header from "@/components/Header";
import RecordView from "@/components/RecordView";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CollectionListView from "@/components/CollectionListView";
import { CItem, useAppStore, useShallowAppStore } from "@/store/app-store";
import { useState } from "react";
import EditText from "@/components/EditText";
export default function UI() {
  const { collections } = useShallowAppStore((s) => ({
    collections: s.collections,
  }));
  if (collections.length == 0) return;
  return (
    <div className="w-full px-4 py-2 space-y-3">
      <Header />
      <TestBox>
        <EditTextTest />
      </TestBox>
      <TestBox>
        <CollectionListView collections={collections} />
      </TestBox>
    </div>
  );
}

function EditTextTest() {
  const [text, setText] = useState("hello");
  console.log(text);
  return (
    <div className="flex flex-col gap-2 p-2">
      <EditText className="border" value={text} onChange={setText} />
      <EditText className="border" value={text} onChange={setText} isSecret />
      <EditText className="border" placeholder="write here" />
      <EditText
        className="border"
        value={text}
        onChange={setText}
        isMultiline
      />
    </div>
  );
}

function TestBox({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <ResizablePanelGroup className="p-3 gap-2 shadow-md" direction="horizontal">
      <ResizablePanel defaultSize={50}>
        <div className="border p-2">{children}</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="border p-2">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
