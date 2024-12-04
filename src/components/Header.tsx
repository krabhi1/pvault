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
import { useShallowAppStore } from "@/store/app-store";

export default function () {
  const { username, signout } = useAuth();
  const {
    isConfirmDelete,
    setConfirmDelete,
    isAutoSaveOn,
    setIsAutoSaveOn,
    isShowDeleted,
    setIsShowDelete,
  } = useShallowAppStore((s) => ({
    isConfirmDelete: s.isConfirmDelete,
    setConfirmDelete: s.setConfirmDelete,
    isAutoSaveOn: s.isAutoSaveOn,
    setIsAutoSaveOn: s.setIsAutoSaveOn,
    isShowDeleted: s.isShowDeleted,
    setIsShowDelete: s.setIsShowDelete,
  }));
  return (
    <div className="h-12 flex justify-between mx-2  items-center ">
      <h2 className="text-3xl text-blue-600 font-bold">PVault</h2>
      <div className="flex gap-2 items-center">
        <Button variant="destructive">Logout</Button>
        <Button>Update(0)</Button>

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
