"use client";

import { FormEvent, useState } from "react";
import styles from "./login.module.css";

export default function FounderLogin() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [status, setStatus] = useState<"idle" | "sending" | "verifying" | "error">("idle");
  const [message, setMessage] = useState("");

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const response = await fetch("/api/founder/auth/request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    if (!response.ok) {
      setStatus("error");
      setMessage("A security code could not be sent. Please wait a moment and try again.");
      return;
    }
    setStatus("idle");
    setStage("code");
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("verifying");
    setMessage("");
    const response = await fetch("/api/founder/auth/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, code }) });
    if (!response.ok) {
      setStatus("error");
      setMessage("That code is invalid or has expired. Check the newest email and try again.");
      return;
    }
    window.location.assign("/founder");
  }

  if (stage === "email") return <form className={styles.form} onSubmit={requestCode}>
    <label>Founder email address<input type="email" autoComplete="email" required maxLength={160} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@medics-global.com" /></label>
    <button disabled={status === "sending"}>{status === "sending" ? "Sending secure code…" : "Email me a security code →"}</button>
    {message && <p className={styles.formError} role="alert">{message}</p>}
  </form>;

  return <form className={styles.form} onSubmit={verifyCode}>
    <div className={styles.sent}><b>Check your email</b><span>A six-digit code was sent if this address is authorized.</span></div>
    <label>Six-digit security code<input className={styles.code} inputMode="numeric" autoComplete="one-time-code" required minLength={6} maxLength={6} pattern="[0-9]{6}" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" /></label>
    <button disabled={status === "verifying" || code.length !== 6}>{status === "verifying" ? "Verifying…" : "Open Founder Desk →"}</button>
    <button className={styles.secondary} type="button" onClick={() => { setStage("email"); setCode(""); setMessage(""); setStatus("idle"); }}>Use a different email</button>
    {message && <p className={styles.formError} role="alert">{message}</p>}
  </form>;
}
