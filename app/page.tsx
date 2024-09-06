"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getFile, updateFile, verifyLogin } from "./api-utils";
import { useImmer } from "use-immer";
import { decode, encode } from "./crypt";
import { LoadingBox } from "./components/Loading";
import Header from "./components/Header";
import "@/app/styles/editor.css";
import { CredentialGroup } from "./store/appStore";
import CredentialGroupView from "./components/CredentialGroup";
// import CredentialCard, { CredentialGroup } from "./components/CredentialCard";

import { useCredentialStore } from "./store/appStore";
import CredentialChild from "./components/CredentialChild";
import toast, { Toaster } from "react-hot-toast";
import {
  CredentialRawGroupData,
  toExportableJson,
  toImportableJson,
} from "./utils";

export default function Main() {
  return (
    <>
      <Home />
      <Toaster />
    </>
  );
}

function Home() {
  const page = useCredentialStore((s) => s.page);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("nitesh");
  const [isLoading, setIsLoading] = useState(false);

  if (page == "login")
    return (
      <>
        <Login
          password={password}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setPassword={setPassword}
          username={username}
          setUsername={setUsername}
        />
        <LoadingBox isLoading={isLoading} />
      </>
    );
  if (page == "editor")
    return (
      <>
        <Editor
          password={password}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          username={username}
          setPassword={setPassword}
        />
        <LoadingBox isLoading={isLoading} />
      </>
    );
  return "Unknown page";
}

function Login({
  password,
  username,
  isLoading,
  setIsLoading,
  setPassword,
  setUsername,
}: {
  password: string;
  username: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setUsername: Dispatch<SetStateAction<string>>;
}) {
  const changePage = useCredentialStore((s) => s.changePage);
  async function handleLogin() {
    if (password && username && password.length > 0 && username.length > 0) {
      setIsLoading(true);
      const verifyResult = await verifyLogin(username, password);
      setIsLoading(false);

      console.log(verifyResult);
      if (verifyResult.data) {
        changePage("editor");
      } else {
        toast.error(verifyResult.message!!, { position: "bottom-center" });
      }
    } else {
      toast.error("Please enter username and password", {
        position: "bottom-center",
      });
    }
  }
  return (
    <div className="login-wrapper">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="login"
        autoComplete="off"
        autoSave="off"
      >
        <label>Username</label>
        <select value={username} onChange={(e) => setUsername(e.target.value)}>
          <option value="nitesh">Nitesh</option>
          <option value="abhishek">Abhishek</option>
        </select>
        <label>Password</label>

        <input
          type="password"
          value={password}
          placeholder="Key"
          onChange={(e) => setPassword(e.target.value)}
        />
        <span>
          <button type="submit" className="primary">
            Login
          </button>
        </span>
      </form>
    </div>
  );
}

/*
  async function load() {
    const res = await getFile(username!, password!);
    if (res.data) {
      const decrypted = await decode(res.data, password);
      setText((d) => {
        if (res.data) {
          d.old = decrypted;
          d.new = decrypted;
        }
        setLoading(false);
      });
    } else {
      alert(res.message);
    }
  }

  async function handleUpdate() {
    if (text.old !== text.new) {
      setIsSaving(true);
      const encrypted = await encode(text.new, password);
      const res = await updateFile(username!, password!, encrypted);
      setIsSaving(false);
      if (res.data) {
        setText((d) => {
          d.old = d.new;
        });
        // alert("File updated successfully");
      } else {
        alert(res.message);
      }
    }
  }
*/

function Editor({
  password,
  username,
  isLoading,
  setIsLoading,
  setPassword,
}: {
  password: string;
  username: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setPassword: Dispatch<SetStateAction<string>>;
}) {
  const credentials = useCredentialStore((s) => s.credentials);
  const onAddGroup = useCredentialStore((s) => s.addGroup);
  const onToggleGroup = useCredentialStore((s) => s.toggleGroup);
  const onAddCredential = useCredentialStore((s) => s.addCredential);
  const onGroupRename = useCredentialStore((s) => s.renameGroup);
  const onDeleteGroup = useCredentialStore((s) => s.deleteGroup);
  const deleteCredential = useCredentialStore((s) => s.deleteCredential);
  const updateCredential = useCredentialStore((s) => s.updateCredential);
  const setData = useCredentialStore((s) => s.setData);
  const updateCount = useCredentialStore((s) => s.updateTimes);
  const logout = useCredentialStore((s) => s.logout);
  const reset = useCredentialStore((s) => s.reset);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await getFile(username!, password!);
      if (res.data) {
        const decrypted = await decode(res.data, password);
        const obj = JSON.parse(decrypted) as CredentialRawGroupData[];
        const data = toImportableJson(obj);
        setData(data);
      } else {
        throw new Error(res.message);
      }
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message, { position: "bottom-center" });
    }
  }

  async function onSave() {
    if (updateCount === 0) {
      toast.error("No changes to save", { position: "bottom-center" });
      return;
    }
    setIsLoading(true);
    const text = JSON.stringify(toExportableJson(credentials));
    const encrypted = await encode(text, password);
    const res = await updateFile(username, password, encrypted);
    setIsLoading(false);
    if (res.data) {
      toast.success("File updated successfully", { position: "bottom-center" });
      reset();
    } else {
      toast.error(res.message!, { position: "bottom-center" });
    }
  }

  function onLogout() {
    if (updateCount) {
      const isOk = confirm(
        "Your changes are not saved. Do you want to logout?"
      );
      if (!isOk) return;
    }

    logout();
    setPassword("");
  }

  return (
    <div>
      {
        <section className="editor-page">
          <Header
            onLogout={onLogout}
            onSave={onSave}
            updateCount={updateCount}
          />

          <div className="editor">
            <h2>Credentials ({credentials.length})</h2>
            <div className="credential-holder">
              {credentials.map((c, index) => (
                <CredentialGroupView
                  credential={c}
                  key={index}
                  onToggleGroup={onToggleGroup}
                  onAddCredential={onAddCredential}
                  onGroupDelete={onDeleteGroup}
                  onGroupRename={onGroupRename}
                >
                  {c.children.map((child, index2) => (
                    <CredentialChild
                      key={index2}
                      credential={child}
                      deleteCredential={deleteCredential}
                      updateCredential={updateCredential}
                    />
                  ))}
                </CredentialGroupView>
              ))}

              <CredentialGroupView onAddGroup={onAddGroup} />
            </div>
          </div>
        </section>
      }
    </div>
  );
}
