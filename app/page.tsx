"use client";

import { FormEvent, useState } from "react";
import { apiEndpoint, publicHref } from "./lib/public-runtime";

const researchPillars = [
  {
    mark: "01",
    title: "Brain health and aging",
    text: "Neuroimaging, cognition, cerebrovascular disease, neurodegeneration, resilience, and healthy aging are the scientific center of BIBHA.",
    tags: ["Neuroimaging", "Cognition", "Brain aging"],
  },
  {
    mark: "02",
    title: "Whole-person determinants",
    text: "We study how vascular, metabolic, cardiovascular, kidney, liver, behavioral, psychological, and social factors shape brain health.",
    tags: ["Vascular", "Metabolic", "Behavioral"],
  },
  {
    mark: "03",
    title: "Computational human-data science",
    text: "Statistics, machine learning, multimodal integration, computational omics, and reproducible workflows turn complex data into useful evidence.",
    tags: ["Statistics", "AI / ML", "Multimodal data"],
  },
];

const audiences = [
  { mark: "01", title: "Students & emerging researchers", text: "Build evidence of research ability through a defined role, close mentorship, reproducible work, and a documented contribution.", action: "Join as a researcher" },
  { mark: "02", title: "PIs & diaspora mentors", text: "Help shape answerable questions, guide methods, and build durable research capacity across borders without creating another passive network.", action: "Mentor or lead" },
  { mark: "03", title: "Institutions & research partners", text: "Explore governed collaborations around locally meaningful questions, transparent analysis, and capacity that remains useful after a project ends.", action: "Explore partnership" },
];

const safeguards = [
  ["Bangladeshi leadership", "Work involving Bangladesh must include meaningful local scientific leadership, interpretation, and capacity transfer."],
  ["Contribution before prestige", "A contribution charter and CRediT-style record make roles, decisions, and scientific credit visible from the start."],
  ["Governed access", "Data access follows the minimum necessary principle and requires the relevant project, ethics, training, and custodian approvals."],
  ["Continuity by design", "Protocols, code, quality decisions, results—including nulls—and next questions are prepared for the next team."],
];

const termSteps = [
  ["01", "Scope", "Question, feasibility, governance, and analysis plan"],
  ["02", "Form", "Role-based team and contribution charter"],
  ["03", "Deliver", "Weekly work with milestone reviews"],
  ["04", "Close", "Outputs, contribution record, and Continuation Pack"],
];

export default function Home() {
  const [interestState, setInterestState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [confirmationEmail, setConfirmationEmail] = useState<"sent" | "not_configured" | "failed" | "">("");

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
        <a className="brand" href="#top" aria-label="BIBHA Institute home"><img className="brand-logo" src="/bibha-logo.png" alt="BIBHA Institute" /></a>
        <div className="nav-links"><a href="#research">Research</a><a href="#pilot">Founding pilot</a><a href="#model">How it works</a><a href="#trust">Principles</a><a href="https://portal.bibha.medics-global.com/" target="_blank" rel="noopener noreferrer">Research portal</a></div>
        <a className="nav-cta" href="#join">Join the founding network <span>↗</span></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="signal"><span /> Founding network · Bangladesh-centered · Globally connected</div>
          <h1>Research talent is everywhere.<br /><em>Opportunity should be too.</em></h1>
          <p className="hero-lede"><strong>BIBHA Institute</strong>—the Bangladesh Institute for Brain Health and Analytics—is a proposed research network advancing brain health and aging through computational human-data science, with whole-person and systemic health built into the question.</p>
          <div className="hero-actions"><a className="button primary" href="https://portal.bibha.medics-global.com/" target="_blank" rel="noopener noreferrer">Open the Research Portal <span>↗</span></a><a className="button secondary" href="#research">Explore our research focus</a><a className="button secondary" href="#join">Register your interest</a></div>
          <div className="hero-guardrails"><span><b>01</b> Brain-centered</span><span><b>02</b> Computational first</span><span><b>03</b> Bangladesh ↔ Global</span></div>
        </div>
        <div className="network-stage" aria-label="BIBHA connects Bangladesh with mentors, methods, and research collaborators worldwide">
          <div className="stage-grid" /><span className="route r1" /><span className="route r2" /><span className="route r3" /><span className="route r4" />
          <div className="hub"><b>BIBHA</b><small>INSTITUTE</small></div>
          <div className="city dhaka"><i>BD</i><span><b>Bangladesh</b><small>Questions · talent · leadership</small></span></div>
          <div className="city boston"><i>DM</i><span><b>Diaspora mentors</b><small>Methods · guidance</small></span></div>
          <div className="city london"><i>GC</i><span><b>Global collaborators</b><small>Expertise · partnership</small></span></div>
          <div className="city toronto"><i>OS</i><span><b>Open science</b><small>Reproducibility · continuity</small></span></div>
          <div className="live-card"><span className="pulse" /><div><small>VERSION 2.2 · FOUNDING PHASE</small><b>One focused pilot first</b></div></div>
        </div>
      </section>

      <section className="premise strip"><p>THE SCIENTIFIC PREMISE</p><h2>Brain health is shaped by more than the brain.</h2><p>BIBHA keeps the brain at the center while studying the vascular, metabolic, behavioral, social, and molecular systems that influence it across the life course.</p></section>

      <section className="section research-section" id="research">
        <div className="section-heading"><div><p className="eyebrow">What we study</p><h2>A focused scientific identity,<br />built to connect systems.</h2></div><p>Our scope is intentionally clear: computational research on human brain health in the context of whole-person and systemic health.</p></div>
        <div className="pillar-grid">{researchPillars.map((pillar) => <article className="pillar-card" key={pillar.mark}><span>{pillar.mark}</span><h3>{pillar.title}</h3><p>{pillar.text}</p><div>{pillar.tags.map((tag) => <small key={tag}>{tag}</small>)}</div></article>)}</div>
      </section>

      <section className="pilot-section" id="pilot">
        <div className="pilot-intro"><p className="eyebrow light">Founding Pilot 01 · In development</p><h2>Vascular and systemic influences on brain health and aging.</h2><p>The first BIBHA program is being designed as one answerable, no-PHI computational project using public or appropriately approved de-identified data. It is not yet an open study or confirmed partnership.</p><a className="button pilot-button" href="#join">Help shape the pilot →</a></div>
        <div className="pilot-brief">
          <header><span>BIBHA / FOUNDING PILOT BRIEF</span><b>01</b></header>
          <div><small>QUESTION</small><p>How do vascular and whole-person risk factors relate to measurable patterns of brain health and aging?</p></div>
          <div><small>FIRST OUTPUTS</small><p>Locked analysis plan · reproducible workflow · quality report · interpretable results · next-question map</p></div>
          <div><small>FOUNDING ROLES</small><p>Project lead · methods mentors · analysts · trainees · institutional and community advisors</p></div>
          <footer>Scope, data source, leadership, and timeline will be published only after confirmation.</footer>
        </div>
      </section>

      <section className="section" id="model">
        <div className="section-heading"><div><p className="eyebrow">One network · three entry points</p><h2>A place to contribute,<br />lead, and build capacity.</h2></div><p>BIBHA is designed around real research roles and accountable outputs—not passive networking or credential collection.</p></div>
        <div className="audience-grid">{audiences.map((item) => <article className="audience-card" key={item.mark}><span className="card-number">{item.mark}</span><div className="audience-symbol">{item.mark === "01" ? "↗" : item.mark === "02" ? "◎" : "⌂"}</div><h3>{item.title}</h3><p>{item.text}</p><a href="#join">{item.action} <span>→</span></a></article>)}</div>
        <div className="term-model"><div className="term-intro"><p className="eyebrow light">The four-month research term</p><h3>Short enough to finish.<br />Serious enough to matter.</h3><p>Every project begins with an answerable question and ends with reusable evidence—not a vague promise to collaborate.</p><span>16 WEEKS · COMPUTATIONAL FIRST</span></div><div className="term-track">{termSteps.map(([n,t,d]) => <div className="term-step" key={n}><b>{n}</b><span><strong>{t}</strong><small>{d}</small></span></div>)}</div></div>
      </section>

      <section className="continuity-section">
        <div className="continuity-copy"><p className="eyebrow light">The BIBHA difference</p><h2>Publication is an outcome.<br />Continuity is an obligation.</h2><p>The next researcher should not need to reconstruct what was tried, what failed, what worked, and which question comes next. Each completed project should leave a versioned Continuation Pack.</p><a href="#join">Help build the first Continuation Pack →</a></div>
        <div className="pack-card"><header><span>BIBHA / CONTINUATION PACK</span><b>PROPOSED FORMAT</b></header><h3>What the next team<br />should inherit</h3><p>ONE REVIEWABLE RECORD · VERSIONED AT CLOSEOUT</p><div className="pack-list"><span><b>01</b> Locked question and analysis plan <i>✓</i></span><span><b>02</b> Reproducible code and environment <i>✓</i></span><span><b>03</b> Figures, QC, and decision log <i>✓</i></span><span><b>04</b> Null and sensitivity results <i>✓</i></span><span><b>05</b> Ranked next-question map <i>✓</i></span></div><footer><span>Transparent contributions</span><span>Reusable assets</span><span>Public summary when permitted</span></footer></div>
      </section>

      <section className="section trust" id="trust">
        <div className="section-heading"><div><p className="eyebrow">Principles before scale</p><h2>Trust is part of<br />the research design.</h2></div><p>Growth should follow evidence of scientific quality, responsible governance, participant protection, local leadership, and reliable delivery.</p></div>
        <div className="safeguard-grid">{safeguards.map(([title,text], index) => <article key={title}><span>{String(index + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="path-strip"><article><small>NOW</small><h3>Build the founding network</h3><p>Confirm advisors, mentors, contributors, and the scope of one feasible pilot.</p></article><article><small>NEXT</small><h3>Complete one research term</h3><p>Test the operating model, publish the closeout evidence, and learn before scaling.</p></article><article><small>EARNED GROWTH</small><h3>Expand only after proof</h3><p>Add projects and partnerships when governance, quality, and capacity are demonstrated.</p></article></div>
      </section>

      <section className="about-section" id="about"><div><p className="eyebrow light">About BIBHA</p><h2>An institute in formation,<br />with a precise place to begin.</h2></div><div><p>BIBHA Institute is an independent proposed initiative founded and led by <a className="founder-link" href="https://khalid-saifullah.com/" target="_blank" rel="noopener noreferrer">Khalid Saifullah</a>, whose research spans neuroimaging, neuropathology, brain aging, and computational methods.</p><p>Its immediate purpose is to build a credible Bangladesh-centered network and complete a transparent founding pilot. Advisors, institutions, data resources, and partnerships will be named only after explicit confirmation.</p><p className="status-note"><b>Current status</b> Version 2.2 is a founding-network and pilot-design release—not a clinical service, degree program, funding program, or member account platform.</p></div></section>

      <section className="join-section" id="join">
        <div className="join-copy"><p className="eyebrow light">Founding network registry</p><h2>Help shape the first<br />BIBHA research term.</h2><p>Register as a learner, researcher, mentor, institutional partner, supporter, or prospective study-community advisor.</p><div className="privacy-note"><b>Professional interests only.</b><span>This form does not request clinical data, research datasets, CVs, identity documents, or payments. <a href={publicHref("/privacy")}>Read the privacy notice →</a></span></div><div className="next-steps"><b>WHAT HAPPENS NEXT</b><span><i>1</i>Your response enters the private Founder Desk.</span><span><i>2</i>Responses are reviewed for founding-network and pilot fit.</span><span><i>3</i>Suitable contributors are contacted as roles become defined.</span></div></div>
        {interestState === "sent" ? <div className="registration-receipt" role="status"><span>✓</span><p className="eyebrow">Interest registered</p><h3>Your response is in the founding-network registry.</h3><p>It has been stored for review. This is not yet a member account or project acceptance.</p><div><b>{confirmationEmail === "sent" ? "A confirmation email is on its way." : "Email confirmation is being activated for the pilot."}</b><small>You do not need to submit again. BIBHA will contact suitable contributors as the pilot develops.</small></div><button className="button secondary" onClick={() => setInterestState("idle")}>Register another person</button></div> : <form className="join-form" onSubmit={(event) => submitForm(event, "/api/interest", "interest")}>
          <div className="form-row"><label>Full name<input name="name" required maxLength={100} placeholder="Your name" /></label><label>Email address<input type="email" name="email" required maxLength={160} placeholder="you@institution.edu" /></label></div>
          <div className="form-row"><label>How would you participate?<select name="role" required defaultValue=""><option value="" disabled>Select a role</option><option>Undergraduate or Master’s student</option><option>PhD student or postdoctoral researcher</option><option>Professor, PI, or diaspora mentor</option><option>Clinician or institutional partner</option><option>Donor, advisor, or supporter</option><option>Study-community representative</option></select></label><label>Where are you based?<input name="location" required maxLength={120} placeholder="City, country" /></label></div>
          <label>Research interests<input name="interests" required maxLength={240} placeholder="e.g., neuroimaging, vascular health, statistics" /></label>
          <label>How might you contribute? <span>Optional</span><textarea name="contribution" maxLength={700} placeholder="Tell us what you would like to learn, lead, contribute, or support." /></label>
          <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
          <label className="consent"><input type="checkbox" name="consent" value="yes" required /><span>I agree that BIBHA Institute may store this information and contact me about the founding network. I can request removal at any time.</span></label>
          <button className="button form-submit" disabled={interestState === "sending" || interestState === "sent"}>{interestState === "sending" ? "Saving…" : interestState === "sent" ? "Interest registered ✓" : "Join the founding network →"}</button>{interestState === "error" && <p className="form-error">We could not save your response. Please try again shortly.</p>}
        </form>}
      </section>

      <section className="feedback-section" id="feedback"><div><p className="eyebrow">Contact and critique</p><h2>What should BIBHA prove next?</h2><p>Questions, partnership inquiries, privacy requests, and constructive criticism are welcome.</p></div><form onSubmit={(event) => submitForm(event, "/api/feedback", "feedback")}>
        <label>Your perspective<select name="audience" required defaultValue=""><option value="" disabled>Select one</option><option>Student or trainee</option><option>PI or mentor</option><option>Institutional or hospital leader</option><option>Research participant or community member</option><option>Funder or supporter</option><option>Privacy or data request</option></select></label>
        <label>How compelling is the concept?<select name="rating" required defaultValue=""><option value="" disabled>Choose 1–5</option><option value="5">5 — Very compelling</option><option value="4">4 — Promising</option><option value="3">3 — Needs clarification</option><option value="2">2 — Major concerns</option><option value="1">1 — Not compelling yet</option></select></label>
        <label className="wide">Email address <span>Optional—required if you want a reply</span><input type="email" name="email" maxLength={160} placeholder="you@institution.edu" /></label>
        <label className="wide">Your message<textarea name="message" required maxLength={1200} placeholder="What should BIBHA prove, clarify, or change next?" /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <button disabled={feedbackState === "sending" || feedbackState === "sent"}>{feedbackState === "sending" ? "Sending…" : feedbackState === "sent" ? "Message received ✓" : "Send message →"}</button>{feedbackState === "error" && <p className="form-error wide">We could not save your message. Please try again shortly.</p>}
      </form></section>

      <footer className="site-footer"><a className="brand footer-brand" href="#top" aria-label="BIBHA Institute home"><img className="brand-logo" src="/bibha-logo.png" alt="BIBHA Institute" /></a><p>Bangladesh-centered research on brain health and aging in whole-person context.<br />Current release: Version 2.2 · Founding network and pilot design.</p><div><a href="#research">Research focus</a><a href="#pilot">Founding pilot</a><a href="#model">How it works</a><a href="#trust">Principles</a><a href="#about">About</a><a href="#join">Join</a><a href="#feedback">Contact</a><a href="https://portal.bibha.medics-global.com/" target="_blank" rel="noopener noreferrer">Research Portal</a><a href={publicHref("/privacy")}>Privacy</a><a href={publicHref("/founder")}>Founder Desk</a></div><small>© 2026 BIBHA Institute — Bangladesh Institute for Brain Health and Analytics. Founded and led by Khalid Saifullah. Version 2.2.</small></footer>
    </main>
  );
}
