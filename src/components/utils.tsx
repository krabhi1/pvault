import { CItem, Collection } from "@/store/app-store";

export type ReactProps<T> = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & T;

export type Status = "new" | "deleted" | "updated" | "normal";
export function getCollectionStatus(c: Collection): Status {
  let status: Status = "normal";
  if (c._isDeleted) status = "deleted";
  else if (c._originalName == undefined) status = "new";
  else if (c._originalName != c.name) status = "updated";
  return status;
}

export function getItemStatus(c: CItem): Status {
  let status: Status = "normal";
  if (c._isDeleted) status = "deleted";
  else if (c._originalkey == undefined) status = "new";
  else if (c._originalkey != c.key || c._originalvalue != c.value)
    status = "updated";
  return status;
}

export function statusToColor(status: Status) {
  if (status == "new") return "green";
  else if (status == "updated") return "yellow";
  else if (status == "deleted") return "red";
  else return "transparent";
}
