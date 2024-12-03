"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { encryptData, decryptData } from "@/lib/crypt";
import { useState } from "react";

export default function Page() {
  const [decrypted, setDecrypted] = useState<string>("");
  const [encrypted, setEncrypted] = useState<string>("");
  const [key, setKey] = useState<string>("");
  async function onEncrypt() {
    if (decrypted && key) {
      try {
        const encrypted = await encryptData(key, decrypted);
        setEncrypted(encrypted);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Encryption error",
          description: error.message,
        });
      }
    }
  }
  async function onDecrypt() {
    if (encrypted && key) {
      try {
        const decrypted = await decryptData(key, encrypted);
        setDecrypted(decrypted);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Decryption error",
          description: error.message,
        });
      }
    }
  }
  function onClear() {
    setKey("");
    setEncrypted("");
    setDecrypted("");
  }
  return (
    <div className="mt-2">
      {/* header */}
      <div className="text-center py-2 text-xl font-semibold">AES-GCM</div>
      <div className="flex p-4 gap-2">
        <div className="flex-1 flex flex-col gap-2 items-center">
          <Label>Decrypted value</Label>
          <Textarea
            onChange={(e) => setDecrypted(e.target.value)}
            value={decrypted}
            rows={8}
          />
        </div>
        <div className=" flex flex-col gap-2 items-center">
          <Label>Key</Label>
          <Input
            onChange={(e) => setKey(e.target.value)}
            value={key}
            className="max-sm:w-[100px]"
          />
          <Button disabled={!key || !decrypted} onClick={onEncrypt}>
            Encrypt
          </Button>
          <Button disabled={!key || !encrypted} onClick={onDecrypt}>
            Decrypt
          </Button>
          <Button
            variant={"destructive"}
            disabled={!key && !encrypted && !decrypted}
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
        <div className="flex-1 flex flex-col gap-2 items-center">
          <Label>Decrypted value</Label>
          <Textarea
            onChange={(e) => setEncrypted(e.target.value)}
            value={encrypted}
            rows={8}
          />
        </div>
      </div>
    </div>
  );
}
