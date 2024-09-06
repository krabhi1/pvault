import { ReactNode, useRef, useState } from "react";
import { CredentialGroup } from "../store/appStore";

export default function CredentialGroupView({
  children,
  credential: credential,
  onToggleGroup,
  onAddGroup,
  onAddCredential,
  onGroupDelete,
  onGroupRename,
}: {
  children?: ReactNode;
  credential?: CredentialGroup;
  onToggleGroup?: (groupId: string) => void;
  onAddGroup?: () => void;
  onAddCredential?: (groupId: string) => void;
  onGroupRename?: (groupId: string, name: string) => void;
  onGroupDelete?: (groupId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const targetRef = useRef<HTMLInputElement>(null);

  function onEditingEnable() {
    if (isEditing) return;
    document.addEventListener("click", onEditingDisable);
    setIsEditing(true);
  }

  function onEditingDisable(e: Event) {
    if (e.target !== targetRef.current) {
      document.removeEventListener("click", onEditingDisable);
      setIsEditing(false);
    }
  }
  return (
    <div className="credential">
      {credential ? (
        <>
          <div className="inner">
            <input
              ref={targetRef}
              type="text"
              className="text"
              disabled={!isEditing}
              value={credential.name}
              onChange={(e) => {
                if (onGroupRename) onGroupRename(credential.id, e.target.value);
              }}
            />
            <div>
              <span className="count">{credential.children.length}</span>
              <button
                onClick={onEditingEnable}
                className="icon-btn primary-fill"
              >
                <EditIcon />
              </button>

              <button
                onClick={() => {
                  const isSuccess = confirm(
                    `Are you sure you want to delete *${credential.name}*?`
                  );
                  if (onGroupDelete && isSuccess) onGroupDelete(credential.id);
                }}
                className="icon-btn danger"
              >
                <DeleteIcon />
              </button>

              <button
                onClick={() => onToggleGroup!!(credential.id)}
                className={
                  "icon-btn rotate " + (credential.open ? "reverse" : "")
                }
              >
                <ArrowIcon />
              </button>
            </div>
          </div>

          {/* dropdown */}
          {credential.open && (
            <div className="dropdown">
              {children}
              <div
                onClick={() => {
                  if (onAddCredential) onAddCredential(credential.id);
                }}
                className="card add-child"
              >
                <AddIcon /> Add Credential
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="inner-outline" onClick={onAddGroup}>
          <AddIcon />
          Add Group
        </div>
      )}
    </div>
  );
}

export function DeleteIcon() {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75Zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5ZM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75Zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75Zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25Z" />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.503 4.627 5.5 6.75v10.504a3.25 3.25 0 0 0 3.25 3.25h8.616a2.251 2.251 0 0 1-2.122 1.5H8.75A4.75 4.75 0 0 1 4 17.254V6.75c0-.98.627-1.815 1.503-2.123ZM17.75 2A2.25 2.25 0 0 1 20 4.25v13a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-13A2.25 2.25 0 0 1 8.75 2h9Zm0 1.5h-9a.75.75 0 0 0-.75.75v13c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75v-13a.75.75 0 0 0-.75-.75Z" />
    </svg>
  );
}

export function EditIcon() {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.03 2.97a3.578 3.578 0 0 1 0 5.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L15.97 2.97a3.578 3.578 0 0 1 5.06 0ZM15 6.06 5.062 16a.75.75 0 0 0-.193.333l-1.05 3.85 3.85-1.05A.75.75 0 0 0 8 18.938L17.94 9 15 6.06Zm2.03-2.03-.97.97L19 7.94l.97-.97a2.079 2.079 0 0 0-2.94-2.94Z" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m19.704 12-8.492-8.727a.75.75 0 1 1 1.075-1.046l9 9.25a.75.75 0 0 1 0 1.046l-9 9.25a.75.75 0 1 1-1.075-1.046L19.705 12Z" />
    </svg>
  );
}

export function AddIcon() {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.75 3a.75.75 0 0 1 .743.648l.007.102.001 7.25h7.253a.75.75 0 0 1 .102 1.493l-.102.007h-7.253l.002 7.25a.75.75 0 0 1-1.493.101l-.007-.102-.002-7.249H3.752a.75.75 0 0 1-.102-1.493L3.752 11h7.25L11 3.75a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );
}
