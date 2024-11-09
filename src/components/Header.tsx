import { Button } from "./ui/button";

export default function () {
  return (
    <div className="h-12 flex justify-between w-full items-center">
      <h2 className="text-3xl text-blue-600 font-bold">PVault</h2>
      <div className="space-x-2">
        <Button variant="destructive">Logout</Button>
        <Button>Update(0)</Button>
      </div>
    </div>
  );
}
