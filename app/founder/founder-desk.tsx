"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { FeedbackRow, InterestRow } from "./page";
import styles from "./founder.module.css";

const statuses = ["new", "reviewing", "contacted", "shortlisted", "closed"];

export default function FounderDesk({ userName, interest: initialInterest, feedback: initialFeedback }: { userName: string; interest: InterestRow[]; feedback: FeedbackRow[] }) {
  const [interest, setInterest] = useState(initialInterest);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saving, setSaving] = useState("");
  const [tab, setTab] = useState<"network" | "feedback">("network");

  const visibleInterest = useMemo(() => interest.filter(row => {
    const haystack = `${row.name} ${row.email} ${row.role} ${row.location} ${row.interests}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (statusFilter === "all" || row.status === statusFilter);
  }), [interest, query, statusFilter]);

  const newInterest = interest.filter(row => row.status === "new").length;
  const newFeedback = feedback.filter(row => row.status === "new").length;
  const emailConfigured = interest.some(row => row.owner_email_status === "sent") || feedback.some(row => row.notification_email_status === "sent");

  async function updateInterest(row: InterestRow, status: string, adminNote = row.admin_note || "") {
    setSaving(row.id);
    const response = await fetch("/api/founder/interest", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: row.id, status, adminNote }) });
    if (response.ok) setInterest(current => current.map(item => item.id === row.id ? { ...item, status, admin_note: adminNote } : item));
    setSaving("");
  }

  async function toggleFeedback(row: FeedbackRow) {
    const status = row.status === "new" ? "reviewed" : "new";
    setSaving(row.id);
    const response = await fetch("/api/founder/feedback", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: row.id, status }) });
    if (response.ok) setFeedback(current => current.map(item => item.id === row.id ? { ...item, status } : item));
    setSaving("");
  }

  return <main className={styles.shell}>
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/"><span>B</span><b>BAIRE</b></Link>
      <p>FOUNDER DESK · V2.1</p>
      <button className={tab === "network" ? styles.active : ""} onClick={() => setTab("network")}>Founding network <em>{newInterest}</em></button>
      <button className={tab === "feedback" ? styles.active : ""} onClick={() => setTab("feedback")}>Stakeholder feedback <em>{newFeedback}</em></button>
      <div className={styles.sideBottom}><small>Signed in as</small><b>{userName}</b><a href="/signout-with-chatgpt?return_to=/">Sign out</a></div>
    </aside>
    <section className={styles.main}>
      <header><div><p>PRIVATE OPERATIONS</p><h1>{tab === "network" ? "Founding network registry" : "Stakeholder feedback"}</h1></div><a className={styles.export} href="/api/founder/export">Export CSV ↓</a></header>
      <div className={styles.metrics}><article><span>Total registrations</span><b>{interest.length}</b></article><article><span>Awaiting review</span><b>{newInterest}</b></article><article><span>Feedback responses</span><b>{feedback.length}</b></article><article><span>Email delivery</span><b className={emailConfigured ? styles.good : styles.warning}>{emailConfigured ? "Active" : "Needs key"}</b></article></div>
      {!emailConfigured && <div className={styles.alert}><b>Email delivery is prepared but not active.</b><span>Registrations are still saved safely. Add the email-provider key to activate owner alerts and applicant confirmations.</span></div>}
      {tab === "network" ? <>
        <div className={styles.filters}><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, email, role, location, or interest" /><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="all">All statuses</option>{statuses.map(status => <option key={status}>{label(status)}</option>)}</select></div>
        <div className={styles.cards}>{visibleInterest.length ? visibleInterest.map(row => <article className={styles.card} key={row.id}>
          <div className={styles.cardTop}><div className={styles.avatar}>{initials(row.name)}</div><div><h2>{row.name}</h2><a href={`mailto:${row.email}`}>{row.email}</a><p>{row.role} · {row.location}</p></div><time>{formatDate(row.created_at)}</time></div>
          <div className={styles.detail}><span><small>RESEARCH INTERESTS</small>{row.interests}</span><span><small>PROPOSED CONTRIBUTION</small>{row.contribution || "Not provided"}</span></div>
          <div className={styles.actions}><label>Status<select value={row.status} disabled={saving === row.id} onChange={event => updateInterest(row, event.target.value)}>{statuses.map(status => <option key={status} value={status}>{label(status)}</option>)}</select></label><label>Private follow-up note<textarea defaultValue={row.admin_note || ""} onBlur={event => event.target.value !== (row.admin_note || "") && updateInterest(row, row.status, event.target.value)} placeholder="Add a note; it is never shown publicly." /></label></div>
          <footer><span>Applicant email: <b>{emailLabel(row.confirmation_email_status)}</b></span><span>Owner alert: <b>{emailLabel(row.owner_email_status)}</b></span>{saving === row.id && <i>Saving…</i>}</footer>
        </article>) : <div className={styles.empty}>No registrations match this view.</div>}</div>
      </> : <div className={styles.cards}>{feedback.length ? feedback.map(row => <article className={`${styles.card} ${row.status === "new" ? styles.unread : ""}`} key={row.id}>
        <div className={styles.feedbackTop}><span><b>{row.rating}/5</b><small>{row.audience}</small></span><time>{formatDate(row.created_at)}</time></div><p className={styles.message}>{row.message}</p>{row.email && <a href={`mailto:${row.email}`}>{row.email}</a>}<button className={styles.reviewButton} disabled={saving === row.id} onClick={() => toggleFeedback(row)}>{row.status === "new" ? "Mark reviewed" : "Mark unread"}</button>
      </article>) : <div className={styles.empty}>No feedback has been submitted yet.</div>}</div>}
    </section>
  </main>;
}

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase(); }
function formatDate(value: number) { return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function label(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
function emailLabel(value: string) { return value === "sent" ? "Sent" : value === "failed" ? "Failed" : "Not active"; }
