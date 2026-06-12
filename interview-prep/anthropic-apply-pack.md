# Apply Pack — Anthropic Research Roles (Top 3)

**Created:** 2026-06-11 · Strategy: research track first (see `modes/_profile.md`). All three postings verified active via Playwright on 2026-06-11.

| Priority | Role | Score | Report | CV (new template, 1 page) |
|---|---|---|---|---|
| 1 | Research Engineer, Model Evaluations | 4.7 | [009](../reports/009-anthropic-2026-05-26.md) | `output/cv-pedro-valois-anthropic-research-engineer-model-evaluations-2026-06-11.pdf` |
| 2 | Research Engineer, Pretraining Scaling | 4.6 | [144](../reports/144-anthropic-2026-06-11.md) | `output/cv-pedro-valois-anthropic-research-engineer-pretraining-scaling-2026-06-11.pdf` |
| 3 | Research Scientist, Interpretability | 4.6 | [145](../reports/145-anthropic-2026-06-11.md) | `output/cv-pedro-valois-anthropic-research-scientist-interpretability-2026-06-11.pdf` |

Anthropic explicitly allows applying to a small number of genuinely-fitting roles; all three are in the research org, so this does not violate the one-track rule (which is about not mixing in Applied AI/GTM — hold those as plan B).

## ⚠️ Before submitting — questions only you can answer

These fields appear on the forms and are still "needs confirmation" in your profile:
1. **Earliest start date** (factor: PhD completed March 2026 — are you free now?)
2. **Work authorization / sponsorship**: answer honestly — you will need US visa sponsorship (Anthropic sponsors; they will ask). For SF/NYC roles answer "Yes" to relocation and 25% in-office.
3. **Salary expectations**: bands are public — Model Evals $320–485K, Pretraining Scaling $350–850K. Recommended: leave blank or state "within the posted band".
4. **Which email** — academic (`pedro@cvlab.cs.tsukuba.ac.jp`) expires after affiliation ends; consider a personal email for applications.

## ⚠️ AI-assistance policy

Anthropic's application forms ask that some written answers (notably "Why Anthropic?") be written **without AI assistance**. The drafts below are *outlines for your own writing* — write the final text yourself, in your voice, and respect the form's instructions wherever they apply.

## Draft answer outlines

### "Why do you want to work at Anthropic?" (write yourself — outline only)
- Your research thesis: interpretability is how AI becomes trustworthy → Anthropic is the only frontier lab where interp is a core bet, not a side project.
- Concrete thread: your TACL Frame Representation Hypothesis work cites and builds on the same questions Anthropic's interp team works on (features, steering, safety auditing).
- The 50/50 identity: you've both published (TACL/EMNLP/NAACL) and carried a pager (Petco, 1M+ users; 256 GH200 training runs) — Anthropic's research-engineer culture is exactly this blend.
- Safety motivation has a track record: CSAM forensics work with Brazilian Federal Police, Human Rights Prize — you choose impact-driven problems.

### "Most impressive technical work" (per role)
- **Model Evals:** the steering library as an *evaluation instrument* — 99%+ attack success rate as a quantitative safety methodology, tested across 4 model families; plus the NAACL metric (designing an evaluation where none existed, multimodal, with proper statistics).
- **Pretraining Scaling:** the 1T-token program — owning everything from a 20TB/15B-document data pipeline to 45%+ MFU via NVLink-C2C offloading on 256 GH200s, and the Mamba-Attention hybrid that cut cost 30% at perplexity parity. Tell it as a debugging/reliability story, not just numbers.
- **RS Interpretability:** FRH itself — extending the Linear Representation Hypothesis to multi-token concepts via Stiefel manifolds, then making it *useful*: concept-guided generation, bias analysis, open-source steering library. Mention the bridge-to-SAE project in progress (development plan gap #1).

### Known soft gaps and honest framings (from reports)
- **JAX/TPU** (Pretraining role lists it as an OR-requirement): your PyTorch/Megatron branch fully satisfies it; don't claim JAX.
- **Dashboards** (Evals role, preferred): frame MFU monitoring + 50-space experiment tracking as operational dashboards; offer to pair on theirs.
- **Frontier-scale production ops:** academic HPC ≠ frontier lab launch ops; frame as "owned failure recovery and on-call for months-long training runs" — true and adjacent.

## Referral plan (do this BEFORE or same week as applying)

1. **EMNLP 2025 contacts**: you presented FRH there — anyone who engaged with the poster/talk who works at or knows people at Anthropic gets a short note: "I'm applying to the interp/evals teams, would you be comfortable referring me?"
2. **Co-author network**: Erica Shimomoto (AIST) and Lincon Souza's networks overlap with industry NLP; ask directly if they know anyone at Anthropic/Goodfire.
3. **Citation outreach (cold, 2-3 max)**: researchers on Anthropic's interpretability team whose work FRH builds on — one short email: FRH result, one sentence on the SAE-bridge project, link to TACL paper, ask for 15 minutes. Researchers answer researchers.
4. **LinkedIn second-degree**: run `/career-ops contacto` for Anthropic to surface mutual connections before submitting.

## Submission checklist (per role)
- [ ] Liveness re-check the posting same day (`node check-liveness.mjs <url>`)
- [ ] Final read of the tailored CV PDF (you, not me)
- [ ] Written answers in your own words (AI-assistance policy)
- [ ] Start date / visa / salary fields decided (section above)
- [ ] Referral pinged before or same day
- [ ] Update tracker status to `Applied` after submitting + log in `data/follow-ups.md` (follow-up at day 7 and 14)
