import { useRef, useState } from "react";
import { CopyIcon, DeleteIcon, EditIcon } from "./CredentialGroup";
import { Credential } from "../store/appStore";
import toast from "react-hot-toast";

export default function CredentialChild({
  credential,
  deleteCredential,
  updateCredential,
}: {
  credential: Credential;
  deleteCredential: (credentialId: string) => void;
  updateCredential: (
    credentialId: string,
    credential: Partial<Credential>
  ) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const keyRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);

  function onEditingEnable() {
    if (isEditing) return;
    document.addEventListener("click", onEditingDisable);
    setIsEditing(true);
  }

  function onEditingDisable(e: Event) {
    if (e.target !== keyRef.current && e.target !== valueRef.current) {
      document.removeEventListener("click", onEditingDisable);
      setIsEditing(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(credential.value);
    toast.success("Copied to clipboard", { position: "bottom-center" });
  }

  return (
    <div className="card">
      <input
        ref={keyRef}
        disabled={!isEditing}
        type="text"
        placeholder="key"
        value={credential.key}
        onChange={(e) =>
          updateCredential(credential.id, { key: e.target.value })
        }
      />
      <input
        ref={valueRef}
        disabled={!isEditing}
        type={isEditing ? "text" : "password"}
        placeholder="value"
        value={credential.value}
        onChange={(e) =>
          updateCredential(credential.id, { value: e.target.value })
        }
      />
      <div>
        <button onClick={copyToClipboard} className="icon-btn">
          <CopyIcon />
        </button>
        <button onClick={onEditingEnable} className="icon-btn primary-fill">
          <EditIcon />
        </button>
        <button
          onClick={() => {
            const isSuccess = confirm(
              `Are you sure you want to delete *${credential.key}*?`
            );

            if (isSuccess) deleteCredential(credential.id);
          }}
          className="icon-btn danger"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}
