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
  if (page == "change-password") return <ChangePassword />;
  return "Unknown page";
}

function Login() {
  const { password, update, username } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    update((d) => {
      d.username = "nitesh";
    });
  }, []);

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
        {/*
        <input
          type="text"
          value={username}
          onChange={(e) => update((d) => (d.username = e.target.value.trim()))}
        />
        */}
        <select
          value={username}
          onChange={(e) => update((d) => (d.username = e.target.value.trim()))}
        >
          <option value="nitesh">Nitesh</option>
          <option value="abhishek">Abhishek</option>
        </select>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => update((d) => (d.password = e.target.value.trim()))}
        />
        <span>
          <button className="med" onClick={handleLogin}>
            Login
          </button>
        </span>
        {/*
          <span>
            <button
              className="link"
              onClick={() => update((d) => (d.page = "change-password"))}
            >
              Change Password
            </button>
          </span>
          */}
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
        <button
          className="med"
          onClick={() => {
            update((d) => {
              d.page = "login";
              d.username = "";
              d.password = "";
            });
          }}
        >
          logout
        </button>
        {canEdit && (
          <button className="med" onClick={handleUpdate}>
            Update
          </button>
        )}
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

function ChangePassword() {
  const [updating, setUpdating] = useState(false);
  const { update } = useAppContext();
  //input state
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleChange() {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setUpdating(true);
    const verifyResult = await verifyLogin(username, oldPassword);
    if (verifyResult.data == undefined) {
      alert(verifyResult.message);
      setUpdating(false);
      return;
    }
    const encText = await getFile(username, oldPassword);
    if (encText.data == undefined) {
      alert(encText.message);
      setUpdating(false);
      return;
    }
    const decText = await decode(encText.data, oldPassword);
    const encNewText = await encode(decText, newPassword);
    const res = await updateFile(username, oldPassword, encNewText);
    if (res.data == undefined) {
      alert(res.message);
      setUpdating(false);
      return;
    }
    setUpdating(false);
    update((d) => {
      d.page = "editor";
      d.username = username;
      d.password = newPassword;
    });
  }
  return (
    <div className="change-pass">
      {updating && (
        <div className="saving">
          <span>Updating...</span>
        </div>
      )}
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Old Password</label>
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <label>New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <label>Confirm Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleChange} className="med">
        Change Password
      </button>
      <button
        className="link"
        onClick={() => update((d) => (d.page = "login"))}
      >
        back to login
      </button>
    </div>
  );
}
