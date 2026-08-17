# Solo Dev Gameplan — Family Business Edition

## The Core Idea

You have no senior. You compensate with **process instead of a person**. Process is slower than instinct but it's the thing instinct is _made of_ — you're building the checklist a senior already has in their head, one rule at a time.

Two rules override everything else in this document:

1. **Tier your tools by blast radius before you write a line of code.**
2. **Never let LLM speed convert into shipping speed. Convert it into thinking time instead.**

---

## Step 1: Tier Everything (do this once, then apply to every new project)

| Tier              | Examples                                                                                                             | Rule                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **T0 — Sandbox**  | Internal dashboards, read-only reports, scripts that summarize data                                                  | Build freely. Break it as much as you want. This is where you actually learn.                                                                                        |
| **T1 — Assisted** | Tools that _suggest_ actions but a human confirms (e.g., "here's the invoice I'd send — click to send")              | Human is always the last step before anything real happens.                                                                                                          |
| **T2 — Critical** | Anything touching money, payroll, customer data, inventory counts, anything that writes without a human double-check | Do NOT build solo without the full checklist below. Consider: is there an existing, boring, battle-tested tool (even paid) that does this instead of you writing it? |

Rule of thumb: **you're not "ready" for T2 by skill — you're ready by process.** Even a senior wouldn't skip the checklist. The checklist _is_ what makes it safe, not your confidence.

---

## Step 2: The Weekly/Monthly Loop

This is the actual habit. Everything else plugs into this.

**Before starting anything new (15 min):**

- Write a 5-10 sentence design note: what am I building, what's the obvious alternative approach, why not that instead.
- Say out loud (or write) what tier it is.

**While building:**

- Ask the LLM to critique your design _before_ you ask it to write code. Use the adversarial prompts below.

**Before anything touches Tier 2:**

- Run the Production Readiness Checklist. Every time. No exceptions, no "just this once."

**When something breaks (it will):**

- Run the 10-Minute Postmortem. Every time, even for small stuff. This is the single highest-leverage habit on this whole page.

**Quarterly:**

- Re-read your old design notes and postmortems. You will wince. That wince is the compressed version of "years of experience."
- Pick one side-constraint project purely for skill-stretching (see bottom of doc).

---

## Checklist A — Before You Build (memorize as: **"What, Why-not, Blast"**)

1. **What** am I actually building, in one sentence?
2. **Why not** the obvious simpler alternative (existing tool, spreadsheet, manual process)?
3. **Blast** radius — T0, T1, or T2?
4. What's the _cheapest_ version I could ship first?
5. If this breaks silently, how would I find out?

---

## Checklist B — Production Readiness (Tier 2 only)

### Memorize as: **"BREAD"**

- **B — Backups exist, AND you've tested restoring one.** An untested backup is a rumor, not a backup.
- **R — Rollback plan.** If this deploy/change is bad, how do you undo it in under 5 minutes?
- **E — Errors are visible.** If it fails at 2am, will you find out today, or in three weeks when someone complains?
- **A — Auth/permissions checked.** Who can see this, who can edit this, did you test the "wrong person" case, not just the "right person" case?
- **D — Degrades safely.** If this tool is down, does the business fall back to a manual process cleanly, or does data get lost/corrupted?

If you can't check all five, it's not ready — full stop, regardless of how confident the code feels.

---

## Checklist C — 10-Minute Postmortem (after literally anything breaks)

### Memorize as: **"What, Why, Which rule"**

1. **What** broke, in plain language (no blame, just facts)?
2. **Why** — root cause, not just symptom (dig one level past "the code was wrong")?
3. **Which rule** would've caught this — add it to BREAD or your own checklist if it's not already covered?

Keep these in one running file. In a year, this file is worth more than any course you could take.

---

## Adversarial LLM Prompts (use these verbatim, not "is this good?")

- "You are a skeptical senior engineer reviewing this. What are you most worried about?"
- "What will break when [the business] triples in size / adds a second location / hires 10 more people?"
- "What's the most boring, standard way to solve this, and why might I be overcomplicating it?"
- "What's a failure mode here that wouldn't show up in my own testing but would show up in production?"
- "Argue against your own previous answer."

---

## Stretch Practice (quarterly, T0 only)

Pick one constraint per quarter, applied to a real small tool:

- No database — files only.
- Must work fully offline.
- Process a queue/log of events instead of request-response.
- Read someone else's small, well-regarded open source tool's source code (not docs) before you build.

This is the deliberate substitute for "worked across different teams/domains" — the thing you'd get for free on a bigger team.

---

## The One-Line Version, If You Forget Everything Else

**Tier it. Write down what and why before you build. BREAD before anything real. Postmortem after anything breaks. Bank LLM time into thinking, not shipping.**
