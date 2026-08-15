import { redirect } from "next/navigation";
import Link from "next/link";
import { founderAuthConfigured, getFounderSession } from "../../lib/founder-auth";
import FounderLogin from "./founder-login";
import styles from "./login.module.css";

export const dynamic = "force-dynamic";

export default async function FounderLoginPage() {
  if (await getFounderSession()) redirect("/founder");

  return <main className={styles.shell}>
    <section className={styles.panel}>
      <Link className={styles.brand} href="/" aria-label="BIBHA Institute home"><img src="/bibha-logo.png" alt="" /></Link>
      <p className={styles.eyebrow}>PRIVATE OPERATIONS</p>
      <h1>Founder Desk</h1>
      <p className={styles.lede}>Sign in with a one-time security code sent to the authorized founder email. No password or ChatGPT account is required.</p>
      {founderAuthConfigured() ? <FounderLogin /> : <div className={styles.error}>Founder authentication is not configured. Contact the site administrator.</div>}
      <div className={styles.safety}><b>Protected by design</b><span>Codes expire after 10 minutes. Sessions expire after 12 hours. Registration data is never stored in this browser.</span></div>
      <Link className={styles.return} href="/">← Return to BIBHA Institute</Link>
    </section>
    <aside className={styles.context}><div><p>BIBHA INSTITUTE</p><h2>A private workspace for accountable follow-through.</h2><ul><li>Review founding-network registrations</li><li>Organize stakeholder feedback</li><li>Record private follow-up notes</li><li>Export the registry when needed</li></ul></div><small>Bangladesh Institute for Brain Health and Analytics</small></aside>
  </main>;
}
