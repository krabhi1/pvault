"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AppProvider, useAppContext } from "./AppContext";
import { getFile, updateFile, verifyLogin } from "./api-utils";
import { useImmer } from "use-immer";
import { decode, encode } from "./crypt";

export default function Main() {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  );
}

function Home() {
  const { page } = useAppContext();
  if (page == "login") return <Login />;
  if (page == "editor") return <Editor />;
  return "Unknown page";
}

function Login() {
  const { password, update, username } = useAppContext();

  async function handleLogin() {
    if (password && username && password.length > 0 && username.length > 0) {
      const verifyResult = await verifyLogin(username, password);
      if (verifyResult.data) {
        update((d) => (d.page = "editor"));
      } else {
        alert(verifyResult.message);
      }
    } else {
      alert("Please enter username and password");
    }
  }
  return (
    <div className="login-wrapper">
      <div className="login">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => update((d) => (d.username = e.target.value.trim()))}
        />
        <label>Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => update((d) => (d.password = e.target.value.trim()))}
        />
        <span>
          <button onClick={handleLogin}>Login</button>
        </span>
      </div>
    </div>
  );
}

function Editor() {
  const [canEdit, setCanEdit] = useState(false);

  const { update, username, password } = useAppContext();
  const [text, setText] = useImmer({ old: "", new: "" });

  const [loading, setLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="editor">
      {isSaving && <div className="saving">Saving...</div>}
      <div className="header">
        <span className="edit">
          <label>edit</label>
          <input
            type="checkbox"
            onChange={(e) => setCanEdit(e.target.checked)}
          />
        </span>
        <span className="space"></span>
        {canEdit && <button onClick={handleUpdate}>Update</button>}
      </div>
      <textarea
        value={text.new}
        readOnly={!canEdit || isSaving}
        onChange={(e) =>
          setText((d) => {
            d.new = e.target.value;
          })
        }
      ></textarea>
    </div>
  );
}
