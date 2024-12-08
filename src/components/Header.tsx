import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { useAppStore, useShallowAppStore } from "@/store/app-store";
import { dataRpc, useRpc } from "@/configs/rpc";
import { encryptData } from "@/lib/crypt";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useCountUp } from "react-countup";
import { useNetworkState, useIdle } from "react-use";
import NetworkStatus from "./NetworkStatus";

type HeaderProps = {
  onUpload?: (value: boolean) => void;
};
export default function Header({ onUpload }: HeaderProps) {
  const { username, password, signout } = useAuth();
  const {
    isConfirmDelete,
    setConfirmDelete,
    isAutoSaveOn,
    setIsAutoSaveOn,
    isShowDeleted,
    setIsShowDelete,
    getCount,
  } = useShallowAppStore((s) => ({
    isConfirmDelete: s.isConfirmDelete,
    setConfirmDelete: s.setConfirmDelete,
    isAutoSaveOn: s.isAutoSaveOn,
    setIsAutoSaveOn: s.setIsAutoSaveOn,
    isShowDeleted: s.isShowDeleted,
    setIsShowDelete: s.setIsShowDelete,
    getCount: s.getChangeCount,
  }));
  const { data, isLoading, error, mutate } = useRpc(dataRpc.index.$put);

  const totalTime = 5 * 60;
  const timerRef = useRef(null);
  const format = useCallback((value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);
  const { start, pauseResume, reset } = useCountUp({
    ref: timerRef,
    start: totalTime,
    end: 0,
    duration: totalTime,
    onReset: () => console.log("Resetted!"),
    onUpdate: () => console.log("Updated!"),
    onPauseResume: () => console.log("Paused or resumed!"),
    onStart: ({ pauseResume }) => console.log(pauseResume),
    onEnd: ({ pauseResume }) => console.log(pauseResume),
    formattingFn: format,
    useEasing: false,
    startOnMount: true,
  });
  const network = useNetworkState();

  async function update() {
    mutate(
      {
        json: {
          encryptedData: await encryptData(
            password,
            JSON.stringify(useAppStore.getState().getUploadData())
          ),
        },
      },
      {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      }
    );
  }
  useEffect(() => {
    if (data) {
      useAppStore.getState().mergeChanges();
    }
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        duration: 3000,
      });
    }
  }, [data, error]);
  useEffect(() => {
    onUpload?.(isLoading);
  }, [isLoading, onUpload]);

  const countIdle = useIdle(1000);
  const count = useMemo(getCount, [countIdle]);

  useEffect(() => {
    const callback = (event: Event) => {
      if (count != 0) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", callback);
    return () => {
      window.removeEventListener("beforeunload", callback);
    };
  }, [count]);

  return (
    <div className="h-12 flex justify-between mx-2  items-center ">
      <div className="flex gap-2 items-center">
        <h2 className="text-3xl text-blue-600 font-bold">PVault</h2>
        <NetworkStatus isOnline={network.online} />
      </div>
      <div>
        <span
          onClick={() => {
            reset();
            start();
          }}
          ref={timerRef}
          className="p-2 text-green-600"
        ></span>
      </div>
      <div className="flex gap-2 items-center">
        <Button onClick={update} disabled={count == 0 || !network.online}>
          {isLoading && <Loader2 className="animate-spin" />}
          Update({count})
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>
                {(username[0] || "").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-3 mt-1 p-2">
            <DropdownMenuLabel>{username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Change password</DropdownMenuItem>
            <DropdownMenuItem>
              Delete Confirmation{" "}
              <Checkbox
                checked={isConfirmDelete}
                onCheckedChange={setConfirmDelete}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              Auto save{" "}
              <Checkbox
                checked={isAutoSaveOn}
                onCheckedChange={setIsAutoSaveOn}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              Show deleted{" "}
              <Checkbox
                checked={isShowDeleted}
                onCheckedChange={setIsShowDelete}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
            <DropdownMenuItem onClick={signout} className="text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
