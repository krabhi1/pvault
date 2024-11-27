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
import { useAppStore } from "@/store/app-store";
export default function () {
  const collections = useAppStore.getState().collections;
  return (
    <div className="w-full px-4 py-2 space-y-3">
      <Header />
      <TestBox>
        <RecordView item={{} as any} />
      </TestBox>
      <TestBox>
        <CollectionListView collections={collections} />
      </TestBox>
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
        <Card className={cn("flex  p-2", className)}>{children}</Card>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <Card className={cn("flex  p-2", className)}>{children}</Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
