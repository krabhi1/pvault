"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AppProvider, useAppContext } from "./utils";
import { updateFile, verifyLogin } from "./api-utils";
import { useImmer } from "use-immer";

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

  async function handleUpdate() {
    if (text.old !== text.new) {
      const res = await updateFile(username!, password!, text.new);
      if (res.data) {
        alert("File updated successfully");
        setText((d) => {
          d.old = d.new;
        });
      } else {
        alert(res.message);
      }
    }
  }

  return (
    <div className="editor">
      <div className="edit">
        <label>edit</label>
        <input type="checkbox" onChange={(e) => setCanEdit(e.target.checked)} />
      </div>
      <textarea
        onChange={(e) =>
          setText((d) => {
            d.new = e.target.value;
          })
        }
      ></textarea>
      {canEdit && (
        <div>
          <button onClick={handleUpdate}>Update</button>
        </div>
      )}
    </div>
  );
}
