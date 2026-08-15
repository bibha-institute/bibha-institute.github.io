"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiEndpoint, publicHref } from "./lib/public-runtime";

type DemoRole = "researcher" | "pi";

const demoSteps = [
  { short: "Match", title: "A focused project finds the right people" },
  { short: "Apply", title: "The application captures fit, not pedigree" },
  { short: "Select", title: "The PI shortlists with transparent criteria" },
  { short: "Meet", title: "A 15-minute fit conversation" },
  { short: "Build", title: "Four months of visible, accountable work" },
  { short: "Close", title: "Contributions become portable evidence" },
  { short: "Continue", title: "The next team starts further ahead" },
];

const audiences = [
  { mark: "01", title: "Students & emerging researchers", text: "Build proof of research ability through defined roles, mentorship, reproducible work, and verified contributions.", action: "Find a role" },
  { mark: "02", title: "PIs & diaspora mentors", text: "Form strong cross-border teams around answerable questions—without rebuilding recruitment and project operations every time.", action: "Lead a project" },
  { mark: "03", title: "Hospitals & research partners", text: "Create a governed pathway from institutional questions to capable teams, controlled analysis, and locally meaningful evidence.", action: "Explore partnership" },
];

const safeguards = [
  ["No pay-to-authorship", "Membership can support the platform; it never purchases project access, data access, or authorship."],
  ["Bangladeshi leadership", "Studies using Bangladeshi data require meaningful local scientific leadership, interpretation, and capacity transfer."],
  ["Minimum necessary access", "A dataset catalog may be visible; row-level data is released only after project, ethics, training, and custodian approvals."],
  ["Contribution before prestige", "CRediT-style records document who designed, coded, analyzed, visualized, supervised, and wrote each output."],
];

const roadmap = [
  ["Now", "Network pilot", "Verified members, mentors, and 3–5 no-PHI computational projects"],
  ["6–24 months", "Cohort pilot", "Written partnerships, ethics, consent, trained staff, and validated systems"],
  ["Years 2–5", "Research commons", "Longitudinal quality, secure workspaces, and stable institutional funding"],
  ["Years 4–10+", "Clinical research pathway", "Registries, trials capability, neuroscience center, then earned hospital feasibility"],
];

export default function Home() {
  const [demoRole, setDemoRole] = useState<DemoRole>("researcher");
  const [demoStep, setDemoStep] = useState(0);
  const [notice, setNotice] = useState("");
  const [interestState, setInterestState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [confirmationEmail, setConfirmationEmail] = useState<"sent" | "not_configured" | "failed" | "">("");

  const progress = useMemo(() => Math.round(((demoStep + 1) / demoSteps.length) * 100), [demoStep]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>, endpoint: string, kind: "interest" | "feedback") {
    event.preventDefault();
    const form = event.currentTarget;
    const setState = kind === "interest" ? setInterestState : setFeedbackState;
    setState("sending");
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.submittedAt = String(performance.timeOrigin);
    const params = new URLSearchParams(window.location.search);
    payload.source = [params.get("utm_source"), params.get("utm_campaign")].filter(Boolean).join(" / ") || document.referrer || "direct";
    try {
      const response = await fetch(apiEndpoint(endpoint), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Submission failed");
      const result = await response.json() as { confirmation?: "sent" | "not_configured" | "failed" };
      if (kind === "interest") setConfirmationEmail(result.confirmation || "");
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <main>
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="BIBHA Institute home">
          <span className="brand-mark">B</span>
          <span><b>BIBHA</b><small>Brain Health & Analytics</small></span>
        </a>
        <div className="nav-links">
          <a href="#model">How it works</a>
          <a href="#demo">Platform demo</a>
          <a href="#trust">Trust</a>
          <a href="#roadmap">Roadmap</a>
        </div>
        <a className="nav-cta" href="#join">Join the founding network <span>↗</span></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="signal"><span /> Building the founding network · Bangladesh ↔ Global</div>
          <h1>Research talent is everywhere.<br /><em>Opportunity should be too.</em></h1>
          <p className="hero-lede"><strong>BIBHA Institute</strong>—the Bangladesh Institute for Brain Health and Analytics—is a proposed research operating system connecting Bangladesh’s emerging scientists with local and diaspora mentors through focused four-month computational projects.</p>
          <div className="hero-actions">
            <a className="button primary" href="#demo">Walk through a project <span>→</span></a>
            <a className="button secondary" href="#join">Register your interest</a>
          </div>
          <div className="hero-guardrails">
            <span><b>01</b> No-PHI pilot first</span>
            <span><b>02</b> Contribution-aware credit</span>
            <span><b>03</b> Governed access by design</span>
          </div>
        </div>
        <div className="network-stage" aria-label="Illustration of BIBHA connecting research communities">
          <div className="stage-grid" />
          <span className="route r1" /><span className="route r2" /><span className="route r3" /><span className="route r4" />
          <div className="hub"><b>BIBHA</b><small>INSTITUTE</small></div>
          <div className="city dhaka"><i>BD</i><span><b>Dhaka</b><small>Students · faculty · clinics</small></span></div>
          <div className="city boston"><i>US</i><span><b>Boston</b><small>Methods · mentorship</small></span></div>
          <div className="city london"><i>UK</i><span><b>London</b><small>Genomics · statistics</small></span></div>
          <div className="city toronto"><i>CA</i><span><b>Toronto</b><small>Imaging · aging</small></span></div>
          <div className="live-card"><span className="pulse" /><div><small>TERM 01 · PROPOSED PILOT</small><b>3–5 focused projects</b></div></div>
        </div>
      </section>

      <section className="premise strip">
        <p>THE PREMISE</p>
        <h2>Stop making every researcher begin again.</h2>
        <p>Each BIBHA project should leave behind a reusable evidence base—protocols, code, figures, null results, decisions, and next questions—so progress compounds.</p>
      </section>

      <section className="section" id="model">
        <div className="section-heading">
          <div><p className="eyebrow">One network · three entry points</p><h2>A place to contribute,<br />lead, and build capacity.</h2></div>
          <p>BIBHA Institute is designed around real research roles and accountable outputs—not passive networking or credential collection.</p>
        </div>
        <div className="audience-grid">
          {audiences.map((item) => (
            <article className="audience-card" key={item.mark}>
              <span className="card-number">{item.mark}</span><div className="audience-symbol">{item.mark === "01" ? "↗" : item.mark === "02" ? "◎" : "⌂"}</div>
              <h3>{item.title}</h3><p>{item.text}</p><a href="#join">{item.action} <span>→</span></a>
            </article>
          ))}
        </div>

        <div className="term-model">
          <div className="term-intro"><p className="eyebrow light">The four-month research term</p><h3>Short enough to finish.<br />Serious enough to matter.</h3><p>Every project begins with a question, a contribution charter, and a closeout artifact—not a vague promise to collaborate.</p><span>16 WEEKS · COMPUTATIONAL FIRST</span></div>
          <div className="term-track">
            {[['01','Scope','Question + analysis plan'],['02','Form','PI recruits a role-based team'],['03','Deliver','Weekly work + milestone reviews'],['04','Close','Output + contribution record'],['05','Continue','Versioned Continuation Pack']].map(([n,t,d]) => <div className="term-step" key={n}><b>{n}</b><span><strong>{t}</strong><small>{d}</small></span></div>)}
          </div>
        </div>
      </section>

      <section className="demo-section" id="demo">
        <div className="section-heading demo-heading">
          <div><p className="eyebrow">Interactive platform walkthrough</p><h2>Follow one project<br />from match to momentum.</h2></div>
          <div className="role-toggle" aria-label="Choose demonstration perspective">
            <button className={demoRole === "researcher" ? "active" : ""} onClick={() => setDemoRole("researcher")}>Researcher view</button>
            <button className={demoRole === "pi" ? "active" : ""} onClick={() => setDemoRole("pi")}>PI view</button>
          </div>
        </div>

        <div className="demo-frame">
          <aside className="demo-sidebar">
            <div className="demo-brand"><span>B</span><b>BIBHA / DEMO</b></div>
            <p>{demoRole === "researcher" ? "RESEARCHER JOURNEY" : "PRINCIPAL INVESTIGATOR JOURNEY"}</p>
            <div className="demo-steps">
              {demoSteps.map((step, index) => (
                <button key={step.short} onClick={() => setDemoStep(index)} className={demoStep === index ? "active" : demoStep > index ? "done" : ""}>
                  <i>{demoStep > index ? "✓" : String(index + 1).padStart(2, "0")}</i><span><b>{step.short}</b><small>{step.title}</small></span>
                </button>
              ))}
            </div>
            <div className="demo-progress"><span><b>Journey progress</b><em>{progress}%</em></span><div><i style={{ width: `${progress}%` }} /></div></div>
          </aside>
          <div className="demo-main">
            <header className="demo-topbar"><span className="demo-context"><i className="avatar">{demoRole === "researcher" ? "AS" : "FR"}</i><span><small>{demoRole === "researcher" ? "SIGNED IN AS" : "PROJECT LEAD"}</small><b>{demoRole === "researcher" ? "Afsana Sultana · MPH student" : "Dr. Farzana Rahman · Toronto"}</b></span></span><span className="demo-badge">SAFE DEMONSTRATION DATA</span></header>
            <DemoPanel role={demoRole} step={demoStep} flash={flash} />
            <footer className="demo-controls">
              <button onClick={() => setDemoStep(Math.max(0, demoStep - 1))} disabled={demoStep === 0}>← Previous</button>
              <span>Step {demoStep + 1} of {demoSteps.length}</span>
              <button className="next" onClick={() => setDemoStep(Math.min(demoSteps.length - 1, demoStep + 1))} disabled={demoStep === demoSteps.length - 1}>Next: {demoSteps[Math.min(demoStep + 1, demoSteps.length - 1)].short} →</button>
            </footer>
          </div>
        </div>
      </section>

      <section className="continuity-section">
        <div className="continuity-copy"><p className="eyebrow light">The BIBHA difference</p><h2>Publication is an outcome.<br />Continuity is an obligation.</h2><p>Journal timelines can be slow. The next researcher should not wait months to understand what was tried, what worked, and which question comes next.</p><a href="#join">Help shape the Continuity Library →</a></div>
        <div className="pack-card">
          <header><span>BIBHA / CONTINUATION PACK</span><b>v1.0</b></header>
          <h3>Cerebrovascular burden<br />in South Asian aging</h3>
          <p>PROJECT BIBHA-NI-001 · CLOSED</p>
          <div className="pack-list"><span><b>01</b> Locked analysis plan <i>✓</i></span><span><b>02</b> Reproducible code <i>✓</i></span><span><b>03</b> Figures + QC decisions <i>✓</i></span><span><b>04</b> Null and sensitivity results <i>✓</i></span><span><b>05</b> Next-question map <i>✓</i></span></div>
          <footer><span>8 contributors</span><span>14 reusable assets</span><span>Public summary</span></footer>
        </div>
      </section>

      <section className="section trust" id="trust">
        <div className="section-heading"><div><p className="eyebrow">Trust before scale</p><h2>A research commons must<br />earn the right to grow.</h2></div><p>The first release is intentionally a no-PHI network pilot. Proposed hospital, cohort, and clinical partnerships remain proposals until written and independently governed.</p></div>
        <div className="safeguard-grid">
          {safeguards.map(([title,text], index) => <article key={title}><span>{String(index + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <div className="boundary"><b>WHAT THIS RELEASE WILL NOT DO</b><div><span>Collect clinical or participant data</span><span>Accept CV or identity-document uploads</span><span>Sell access to datasets or authorship</span><span>Represent proposed partners as confirmed</span></div></div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="roadmap-copy"><p className="eyebrow light">A proof-gated path</p><h2>The hospital is the horizon.<br />Trust is the first infrastructure.</h2><p>BIBHA Institute should progress only when governance, scientific quality, participant protection, institutional capacity, and sustainable funding are demonstrated at the prior stage.</p></div>
        <div className="roadmap-list">
          {roadmap.map(([time,title,text], index) => <article key={title}><span>{String(index + 1).padStart(2,"0")}</span><div><small>{time}</small><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </section>

      <section className="join-section" id="join">
        <div className="join-copy"><p className="eyebrow light">Founding network registry</p><h2>If this future should exist,<br />help us shape it.</h2><p>Register your interest as a learner, researcher, mentor, institutional partner, supporter, or prospective study-community advisor.</p>
          <div className="privacy-note"><b>Minimum information only.</b><span>No clinical data, CVs, publications, identity documents, or payment details are requested here. <a href={publicHref("/privacy")}>Read the privacy notice →</a></span></div>
          <div className="next-steps"><b>WHAT HAPPENS NEXT</b><span><i>1</i>Your response enters the private Founder Desk.</span><span><i>2</i>The founding network is reviewed by role, interest, and pilot fit.</span><span><i>3</i>Suitable contributors are contacted as the first pilot takes shape.</span></div>
        </div>
        {interestState === "sent" ? <div className="registration-receipt" role="status"><span>✓</span><p className="eyebrow">Interest registered</p><h3>You are now part of the founding-network registry.</h3><p>Your response has been stored for review. This is not yet a member account or project acceptance.</p><div><b>{confirmationEmail === "sent" ? "A confirmation email is on its way." : "Email confirmation is being activated for the pilot."}</b><small>You do not need to submit again. BIBHA Institute will contact suitable contributors as the founding pilot develops.</small></div><button className="button secondary" onClick={() => setInterestState("idle")}>Register another person</button></div> : <form className="join-form" onSubmit={(event) => submitForm(event, "/api/interest", "interest")}>
          <div className="form-row"><label>Full name<input name="name" required maxLength={100} placeholder="Your name" /></label><label>Email address<input type="email" name="email" required maxLength={160} placeholder="you@institution.edu" /></label></div>
          <div className="form-row"><label>How would you participate?<select name="role" required defaultValue=""><option value="" disabled>Select a role</option><option>Undergraduate or Master’s student</option><option>PhD student or postdoctoral researcher</option><option>Professor, PI, or diaspora mentor</option><option>Clinician or institutional partner</option><option>Donor, advisor, or supporter</option><option>Study-community representative</option></select></label><label>Where are you based?<input name="location" required maxLength={120} placeholder="City, country" /></label></div>
          <label>Research interests<input name="interests" required maxLength={240} placeholder="e.g., neuroimaging, public health, genomics" /></label>
          <label>How might you contribute? <span>Optional</span><textarea name="contribution" maxLength={700} placeholder="Tell us what you would like to learn, lead, contribute, or support." /></label>
          <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
          <label className="consent"><input type="checkbox" name="consent" value="yes" required /><span>I agree that BIBHA Institute may store this information and contact me about the founding network. I can request removal at any time.</span></label>
          <button className="button form-submit" disabled={interestState === "sending" || interestState === "sent"}>{interestState === "sending" ? "Saving…" : interestState === "sent" ? "Interest registered ✓" : "Join the founding network →"}</button>
          {interestState === "error" && <p className="form-error">We could not save your response. Please try again shortly.</p>}
        </form>}
      </section>

      <section className="feedback-section" id="feedback">
        <div><p className="eyebrow">Built for critique</p><h2>What would make you trust—and use—BIBHA?</h2><p>This release exists to turn assumptions into evidence. Tell us what is unclear, missing, risky, or most valuable.</p></div>
        <form onSubmit={(event) => submitForm(event, "/api/feedback", "feedback")}>
          <label>Your perspective<select name="audience" required defaultValue=""><option value="" disabled>Select one</option><option>Student or trainee</option><option>PI or mentor</option><option>Institutional or hospital leader</option><option>Research participant or community member</option><option>Funder or supporter</option><option>Privacy or data request</option></select></label>
          <label>How compelling is the concept?<select name="rating" required defaultValue=""><option value="" disabled>Choose 1–5</option><option value="5">5 — Very compelling</option><option value="4">4 — Promising</option><option value="3">3 — Needs clarification</option><option value="2">2 — Major concerns</option><option value="1">1 — Not compelling yet</option></select></label>
          <label className="wide">Email address <span>Optional—required if you want a reply</span><input type="email" name="email" maxLength={160} placeholder="you@institution.edu" /></label>
          <label className="wide">Your most important feedback<textarea name="message" required maxLength={1200} placeholder="What should BIBHA Institute prove or change next?" /></label>
          <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <button disabled={feedbackState === "sending" || feedbackState === "sent"}>{feedbackState === "sending" ? "Sending…" : feedbackState === "sent" ? "Feedback received ✓" : "Send feedback →"}</button>
          {feedbackState === "error" && <p className="form-error wide">We could not save your feedback. Please try again shortly.</p>}
        </form>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">B</span><span><b>BIBHA</b><small>Brain Health & Analytics</small></span></a>
        <p>A proposed Bangladesh-centered global research network.<br />Current release: Version 2.1 founding-network pilot · No clinical data.</p>
        <div><a href="#model">How it works</a><a href="#demo">Demo</a><a href="#trust">Governance principles</a><a href="#join">Join</a><a href="#feedback">Contact BIBHA</a><a href={publicHref("/privacy")}>Privacy</a><a href={publicHref("/founder")}>Founder Desk</a></div>
        <small>© 2026 BIBHA Institute — Bangladesh Institute for Brain Health and Analytics. Concept and prototype led by Khalid Saifullah. Version 2.1.</small>
      </footer>

      {notice && <div className="toast" role="status"><span>✓</span>{notice}</div>}
    </main>
  );
}

function DemoPanel({ role, step, flash }: { role: DemoRole; step: number; flash: (message: string) => void }) {
  const stage = demoSteps[step];
  return (
    <section className="demo-content">
      <div className="demo-title"><div><p>STEP {String(step + 1).padStart(2,"0")} / {role === "researcher" ? "RESEARCHER EXPERIENCE" : "PI OPERATIONS"}</p><h3>{stage.title}</h3></div><span className="term-chip">TERM 01 · 16 WEEKS</span></div>
      {step === 0 && <div className="demo-layout"><div className="project-preview"><div className="project-tag"><span /> 94% profile match · Neuroimaging</div><h4>Mapping cerebrovascular burden in South Asian aging</h4><p>Build a reproducible MRI marker pipeline and test associations with cognition using an approved, de-identified training cohort.</p><div className="project-lead"><i>FR</i><span><b>Dr. Farzana Rahman</b><small>University of Toronto · PI</small></span></div><div className="project-stats"><span><b>6–8</b><small>hours / week</small></span><span><b>3</b><small>open roles</small></span><span><b>16</b><small>weeks</small></span></div><button onClick={() => flash(role === "researcher" ? "Project saved to your shortlist" : "Matching criteria opened")}>{role === "researcher" ? "Save matched project" : "Review recommended candidates"} →</button></div><DemoAside title="Why this match" items={role === "researcher" ? ["Python · strong","MRI QC · verified badge","Scientific writing · developing","Availability · aligned"] : ["Methods fit · 4 candidates","Availability · 3 aligned","Institution mix · balanced","Newcomer seats · 1 reserved"]} /></div>}
      {step === 1 && <div className="demo-layout"><div className="application-card"><span className="mini-label">ROLE APPLICATION</span><h4>{role === "researcher" ? "Imaging analyst" : "Afsana Sultana · Imaging analyst"}</h4><div className="answer"><small>{role === "researcher" ? "WHY THIS QUESTION?" : "CANDIDATE MOTIVATION"}</small><p>“I want to learn reproducible vascular imaging while contributing Python QC experience from my MPH thesis.”</p></div><div className="evidence-row"><span><b>Methods evidence</b><small>GitHub notebook · verified</small></span><span><b>Commitment</b><small>7 hrs/week · confirmed</small></span><span><b>Growth goal</b><small>First conference abstract</small></span></div><button onClick={() => flash(role === "researcher" ? "Demonstration application submitted" : "Application added to review set")}>{role === "researcher" ? "Submit demonstration application" : "Add to comparison"} →</button></div><DemoAside title="Fair-entry design" items={["Experience is evidence, not a gate","Newcomer pathway is explicit","Structured questions for every applicant","No rating penalty without prior projects"]} /></div>}
      {step === 2 && <div className="selection-board"><div className="criteria-row"><span>PI REVIEW QUEUE</span><b>8 applicants · 3 interview slots</b></div>{[["AS","Afsana Sultana","Methods 88","Growth 94","Interview"],["RM","Rafi Mahmud","Methods 91","Growth 82","Review"],["TN","Tasnim Noor","Methods 76","Growth 96","Interview"]].map((person,index)=><div className={`candidate ${index===0?"selected":""}`} key={person[1]}><i>{person[0]}</i><span><b>{person[1]}</b><small>{index===0?"MPH · Dhaka · Newcomer":"Research trainee · Bangladesh"}</small></span><em>{person[2]}</em><em>{person[3]}</em><button onClick={() => flash(`${person[1]} moved to ${person[4].toLowerCase()}`)}>{person[4]}</button></div>)}<p className="selection-note">Shortlisting criteria were published with the project. Prior BIBHA ratings are only one signal; newcomers have a protected evidence pathway.</p></div>}
      {step === 3 && <div className="interview-card"><div className="calendar-card"><span>AUG</span><b>22</b><small>FRIDAY</small></div><div className="interview-main"><span className="mini-label">15-MINUTE INFORMATIONAL INTERVIEW</span><h4>A conversation about fit—not an oral examination.</h4><div className="agenda"><span><b>03 min</b> Goals and expectations</span><span><b>07 min</b> Role scenario and working style</span><span><b>03 min</b> Candidate questions</span><span><b>02 min</b> Decision timeline</span></div><button onClick={() => flash("Calendar invitation prepared")}>{role === "researcher" ? "Accept proposed time" : "Send calendar invitation"} →</button></div><DemoAside title="Connected tools" items={["Google / Outlook Calendar","Meet / Zoom link","Email confirmation","Decision captured in BIBHA"]} /></div>}
      {step === 4 && <div className="workspace-card"><div className="workspace-head"><span><small>ACTIVE PROJECT</small><b>White matter signals and vascular risk</b></span><em>ON TRACK</em></div><div className="milestone-list">{[["01","Kickoff + contribution charter","Complete"],["02","Literature map + analysis plan","Complete"],["03","Data dictionary + environment","Complete"],["04","QC report + preliminary figures","Due Aug 29"],["05","Sensitivity analyses","Sep 19"],["06","Abstract + Continuation Pack","Oct 24"]].map(([n,t,s],index)=><div className={index<3?"complete":index===3?"current":""} key={n}><i>{index<3?"✓":n}</i><span><b>{t}</b><small>{s}</small></span>{index===3&&<button onClick={() => flash("Deliverable workspace opened")}>Open</button>}</div>)}</div><div className="workspace-tools"><span>System of record: <b>BIBHA</b></span><span>Communication: <b>Slack</b></span><span>Files: <b>Institution-approved workspace</b></span><span>Code: <b>GitHub</b></span></div></div>}
      {step === 5 && <div className="credit-card"><div className="credit-head"><span><small>VERIFIED PROJECT RECORD</small><h4>Afsana Sultana</h4><p>Imaging analyst · BIBHA-NI-001</p></span><b>4.8<small>team rating</small></b></div><div className="credit-grid"><span><b>Software</b><i>Lead</i><small>QC workflow + tests</small></span><span><b>Visualization</b><i>Equal</i><small>Primary figure set</small></span><span><b>Writing</b><i>Supporting</i><small>Methods + limitations</small></span><span><b>Reproducibility</b><i>Lead</i><small>Environment + README</small></span></div><div className="review-quote">“Reliable, transparent about uncertainty, and generous in helping two newer analysts.”<small>— PI closeout review · visible with permission</small></div><button onClick={() => flash("Contribution certificate prepared")}>Preview portable contribution record →</button></div>}
      {step === 6 && <div className="library-record"><div className="record-cover"><span>BIBHA / CONTINUATION PACK</span><b>NI<br/>001</b><small>VERSION 1.0 · 14 ASSETS</small></div><div className="record-details"><span className="mini-label">READY FOR THE NEXT TEAM</span><h4>Mapping cerebrovascular burden in South Asian aging</h4><p>A concise field position, locked decisions, reproducible workflow, results—including nulls—and a ranked next-question map.</p><div className="record-links"><span>Analysis plan <b>PDF</b></span><span>QC workflow <b>CODE</b></span><span>Figure set <b>6 FILES</b></span><span>Decision log <b>12 ITEMS</b></span><span>Next questions <b>5 RANKED</b></span></div><button onClick={() => flash("Public summary opened")}>Open public summary →</button></div></div>}
    </section>
  );
}

function DemoAside({ title, items }: { title: string; items: string[] }) {
  return <aside className="demo-aside"><p>{title}</p>{items.map((item,index)=><span key={item}><i>{index+1}</i>{item}</span>)}</aside>;
}
