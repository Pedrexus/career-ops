# Development Plan — Research Roles (Japan / US / Canada)

**Created:** 2026-06-11. Owner: Pedro. Strategy: research roles first, Applied AI as plan B (see `modes/_profile.md`).

## Where you already clear the bar

- **Pretraining roles** (Anthropic Pretraining Scaling, Zyphra, Reflection, Magic.dev): 1B-8B models, 1T tokens, 256 GH200, 45%+ MFU, Mamba-Attention cost work. This is rare, verifiable, and maps 1:1 to these JDs. Strongest card.
- **Interpretability research** (Anthropic interp, Goodfire, Transluce): TACL 2025 + EMNLP talk + open-source steering library. Real publication record in the exact field.
- **Production engineering** (all research-engineer roles): AWS years, 20s→200ms, load testing. Most PhD candidates lack this.
- **Niche hook:** C-AIR keywords include *LLM nondeterminism* — Thinking Machines' Numerics role and their determinism blog work are a direct conversation starter.

## Gaps that cost you matches (in priority order)

### 1. Modern mech-interp tooling vocabulary (SAEs, circuits)
Anthropic/Goodfire JDs speak in sparse autoencoders, transcoders, attribution graphs, activation patching. Your work is concept/frame geometry — adjacent, but reviewers pattern-match on their stack.
**Close it:** 4-6 week bridge project: express Frame Representation Hypothesis concepts in SAE feature space (SAELens/nnsight/TransformerLens), publish as a blog post + small repo, ideally a PR to one of those libraries. This converts "different school" into "speaks both dialects".

### 2. RL / post-training experience
Performance RL, post-training, and alignment roles want RLHF/DPO/GRPO hands-on. Nothing on your CV shows it.
**Close it:** post-train a small open model (DPO + verifiable-reward RL) with TRL/verl/OpenRLHF on your cluster access while you still have it; evaluate with lm-eval-harness; write up the training-dynamics lessons. 3-4 weekends of work, removes a recurring disqualifier.

### 3. Evals engineering credibility
You have an eval *metric* paper (NAACL); evals teams (Anthropic Model Evals, Scale SEAL, METR, Citadel AI) want eval *infrastructure*: inspect-ai, lm-eval-harness, agentic task suites.
**Close it:** contribute one non-trivial eval or harness improvement to inspect-ai (UK AISI) or lm-eval-harness. Public, reviewable, fast.

### 4. Public visibility of existing work
The steering library, the MFU/offloading lessons, the FRH result — most of it is invisible outside the paper.
**Close it:** (a) polish the steering library (README with demo GIF, PyPI, docs), (b) two technical posts on phvv.me: "45% MFU on GH200: what actually mattered" and an FRH explainer, (c) link everything from GitHub profile and LinkedIn headline.

### 5. Japanese level (plan B + Japan industry)
Intermediate is fine for research roles at Sakana/PFN/Stockmark-international teams, but business Japanese unlocks the Japan customer-facing plan B and several Japan research labs.
**Close it:** target JLPT N2 (December 2026 sitting), keep a weekly cadence; phrase honestly on CVs ("intermediate, actively studying toward N2").

### 6. Interview execution
Frontier-lab loops: ML coding (transformer from scratch, attention/KV-cache), GPU systems (parallelism strategies, collectives — you have real experience, practice *articulating* it in 5 minutes), research talk, behavioral.
**Close it:** 1 mock per week; build from `interview-prep/story-bank.md`; transformer-from-scratch and Triton puzzles as warm-ups; per-company prep via `/career-ops` interview-prep when interviews land.

## How to start (sequence)

**Week 1 — apply, don't wait.** Your profile already clears 4.5+ on several roles. Tailored CVs (new template) + referral hunting for:
1. Anthropic Research Engineer, Pretraining Scaling (report 144)
2. Anthropic Research Scientist/Engineer, Interpretability (reports 143/145)
3. Anthropic Research Engineer, Model Evaluations (report 009, 4.7)
4. Anthropic Pre-training Zurich (report 010, 4.8) — if open to EU
5. Citadel AI, AI Research Engineer Tokyo — best Japan-local fit
Use contacto mode for warm intros: EMNLP 2025 contacts, Fukui-lab alumni, authors you cite.

**Weeks 1-6 — run gaps #1 and #2 in parallel** (one deep-work day each per week). Each produces a public artifact; mention "in progress" in cover answers.

**Continuous cadence:** ~3-5 high-fit applications/week max (quality gate ≥4.0), follow-ups via followup mode at day 7/14, scan every 3 days, one visibility artifact (post/PR) per month.

**Defer:** new certifications/courses (signal is weak vs. artifacts above), broad-market applications, and any plan-B Applied AI application until a research process at that company has concluded.
