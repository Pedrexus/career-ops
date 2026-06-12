# Mode: pdf — ATS-Optimized PDF Generation

## Full pipeline

1. Read `cv.md` as the source of truth
2. Ask the user for the JD if it is not in context (text or URL)
3. Extract 15-20 keywords from the JD
4. Detect JD language → CV language (EN default)
5. Detect company location → paper format:
   - US/Canada → `letter`
   - Rest of the world → `a4`
6. Detect role archetype → adapt framing
7. Rewrite Professional Summary by injecting JD keywords + the candidate's completed-PhD research-to-systems narrative from `config/profile.yml`
8. Select top 2-3 most relevant projects for the job
9. Reorder experience bullets by JD relevance
10. Build competency grid from JD requirements (6-8 keyword phrases)
11. Inject keywords naturally into existing achievements (NEVER invent)
12. Generate full HTML from template + personalized content
13. Read `name` from `config/profile.yml` → normalize to kebab-case lowercase (e.g. "John Doe" → "john-doe") → `{candidate}`
14. Write HTML to `/tmp/cv-{candidate}-{company}.html`
15. Execute: `node generate-pdf.mjs /tmp/cv-{candidate}-{company}.html output/cv-{candidate}-{company}-{YYYY-MM-DD}.pdf --format={letter|a4} --max-pages=1`
16. Report: PDF path, number of pages, keyword coverage %
17. If PDF generation fails because it exceeds one page, trim content and regenerate. Do not accept a two-page CV.

## ATS Rules (clean parsing)

- Single-column layout (no sidebars, no parallel columns)
- Standard headers: "Professional Summary", "Work Experience", "Education", "Skills", "Certifications", "Projects"
- No text in images/SVGs
- No critical info in PDF headers/footers (ATS ignores them)
- UTF-8, selectable text (not rasterized)
- No nested tables
- Distributed JD keywords: Summary (top 5), first bullet of each role, Skills section

## PDF Design

- **Fonts**: Space Grotesk (headings, 600-700) + DM Sans (body, 400-500)
- **Fonts self-hosted**: `fonts/`
- **Header**: name in Space Grotesk 24px bold + gradient line `linear-gradient(to right, hsl(187,74%,32%), hsl(270,70%,45%))` 2px + contact row
- **Section headers**: Space Grotesk 13px, uppercase, letter-spacing 0.05em, color cyan primary
- **Body**: DM Sans 11px, line-height 1.5
- **Company names**: accent purple color `hsl(270,70%,45%)`
- **Margins**: 0.5in in generated PDFs
- **Background**: pure white

## Section order (optimized "6-second recruiter scan")

1. Header (large name, role tagline, gradient, contact, portfolio link)
2. Impact Highlights (3-4 headline metrics in a strip — value + label)
3. Professional Summary (3-4 lines, keyword-dense)
4. Core Competencies (6-8 keyword phrases in flex-grid)
5. Work Experience (reverse chronological, role shown before company)
6. Projects (top 2-3 most relevant)
7. Education & Certifications
8. Skills (languages + technical)

## Tagline and Impact Highlights

Two elements exist so a screener (human or ATS ranking model) sees the value without reading prose:

- `{{TAGLINE}}` — one line under the name stating the role identity, mirroring the JD title. Example: `Research Scientist — LLM Interpretability & Large-Scale Pretraining | PhD in Computer Science`. Reuse the JD's exact role words when truthful.
- `{{HIGHLIGHTS}}` — 3-4 hard metrics chosen for THIS job, each as:

```html
<div class="highlight">
  <div class="highlight-value">45%+ MFU</div>
  <div class="highlight-label">1T-token LLM pretraining, 256 GPUs</div>
</div>
```

Pick values that are numbers or named outcomes (publication venue, scale, % improvement). Read them from `cv.md` / `article-digest.md` — NEVER invent. Under the hood the strip is plain text in source order, so ATS parsers read it as a normal sentence sequence.

## Job entry markup (role first)

```html
<div class="job">
  <div class="job-header">
    <span class="job-role">Researcher, AI Lab <span class="job-company">— University X</span></span>
    <span class="job-period">Apr 2023 – Mar 2026</span>
  </div>
  <ul>
    <li>Achievement with <strong>metric emphasized in bold</strong>.</li>
  </ul>
</div>
```

Bold every number/metric inside bullets with `<strong>` — that is what the eye lands on.

## Keyword injection strategy (ethical, truth-based)

Examples of legitimate reformulation:
- JD says "RAG pipelines" and CV says "LLM workflows with retrieval" → change to "RAG pipeline design and LLM orchestration workflows"
- JD says "MLOps" and CV says "observability, evals, error handling" → change to "MLOps and observability: evals, error handling, cost monitoring"
- JD says "stakeholder management" and CV says "collaborated with team" → change to "stakeholder management across engineering, operations, and business"

**NEVER add skills that the candidate does not have. Only reword real experience using the exact JD vocabulary.**

## Template HTML

Use the template in `cv-template.html`. Replace the `{{...}}` placeholders with personalized content:

| Placeholder | Content |
|-------------|-----------|
| `{{LANG}}` | `en` or `es` |
| `{{PAGE_WIDTH}}` | `8.5in` (letter) or `210mm` (A4) |
| `{{NAME}}` | (from profile.yml) |
| `{{TAGLINE}}` | One-line role identity mirroring the JD title (see above) |
| `{{HIGHLIGHTS}}` | `<div class="highlight">…</div>` × 3-4 headline metrics (see above) |
| `{{PHONE}}` | (from profile.yml — include with its separator only when `profile.yml` has a non-empty `phone` value; omit both `<span>` and `<span class="separator">` otherwise) |
| `{{EMAIL}}` | (from profile.yml) |
| `{{LINKEDIN_URL}}` | [from profile.yml] |
| `{{LINKEDIN_DISPLAY}}` | [from profile.yml] |
| `{{PORTFOLIO_URL}}` | [from profile.yml] (or /es depending on language) |
| `{{PORTFOLIO_DISPLAY}}` | [from profile.yml] (or /es depending on language) |
| `{{LOCATION}}` | [from profile.yml] |
| `{{SECTION_SUMMARY}}` | Professional Summary |
| `{{SUMMARY_TEXT}}` | Personalized summary with keywords |
| `{{SECTION_COMPETENCIES}}` | Core Competencies |
| `{{COMPETENCIES}}` | `<span class="competency-tag">keyword</span>` × 6-8 |
| `{{SECTION_EXPERIENCE}}` | Work Experience |
| `{{EXPERIENCE}}` | HTML for each job with reordered bullets |
| `{{SECTION_PROJECTS}}` | Projects |
| `{{PROJECTS}}` | HTML for top 2-3 projects |
| `{{SECTION_EDUCATION}}` | Education |
| `{{EDUCATION}}` | Education HTML |
| `{{SECTION_CERTIFICATIONS}}` | Certifications |
| `{{CERTIFICATIONS}}` | Certifications HTML |
| `{{SECTION_SKILLS}}` | Skills |
| `{{SKILLS}}` | Skills HTML |

## Japanese CV (職務経歴書) Generation

For Japan-local roles where Japanese application documents are expected (Japanese JD, Japanese ATS like HRMOS/herp, or the user asks), use `templates/cv-template-ja.html` instead of the default template. Confirm with the user before defaulting to Japanese documents — many Japan-based AI labs accept the English resume.

Conventions:
- A4 always. A 職務経歴書 is conventionally 1-2 pages: generate with `--max-pages=2`, and prefer 1 page when content allows.
- Dates in Japanese format: `2026年6月` (year-month). The header date is the generation date: `2026年6月11日`.
- Body in polite written Japanese (である調 for bullets inside tables, です・ます調 for 職務要約 and 自己PR).
- Translate role/achievement content from `cv.md` — NEVER invent. Keep proper nouns (model names, venues like TACL/EMNLP, AWS services) in Latin script.
- The 職務経歴 section uses one `org-block` per employer: an `org-header` row (company/institution name + 事業内容/在籍期間) followed by a `table.career` with 期間 | 業務内容 columns.
- A 履歴書 (rirekisho) is a separate fixed-form document (often with photo); this template does NOT replace it. If a posting requires a rirekisho, tell the user to fill the standard JIS form (or the employer's form) and offer the profile photo from `cv.md` guardrails.

| Placeholder | Content |
|-------------|---------|
| `{{NAME_JA}}` | Name; for non-Japanese names use katakana + Latin script, e.g. `ペドロ・ヴァス・ヴァロイス（Pedro Vaz Valois）` |
| `{{DATE_JA}}` | `YYYY年M月D日` |
| `{{CONTACT_JA}}` | Email / phone / city line |
| `{{SUMMARY_JA}}` | 職務要約 — 3-5 sentence career summary |
| `{{SKILLS_JA}}` | `<li>…</li>` × 5-8 活かせる経験・知識・技術 |
| `{{CAREER_JA}}` | `org-block` HTML per employer (see above) |
| `{{PUBLICATIONS_JA}}` | `<li>…</li>` main publications, venue names in Latin script |
| `{{EDUCATION_JA}}` | `<tr><td class="col-when">…</td><td>…</td></tr>` rows |
| `{{CERTS_JA}}` | Same row format — 資格 and 語学 levels |
| `{{SELF_PR_JA}}` | 自己PR paragraph tailored to the JD |

## Canva CV Generation (optional)

If `config/profile.yml` has `cv.canva_resume_design_id` set, offer the user a choice before generating:
- **"HTML/PDF (fast, ATS-optimized)"** — existing flow above
- **"Canva CV (visual, design-preserving)"** — new flow below

If the user has no `cv.canva_resume_design_id`, skip this prompt and use the HTML/PDF flow.

### Canva workflow

#### Step 1 — Duplicate the base design

a. `export-design` the base design (using `cv.canva_resume_design_id`) as PDF → get download URL
b. `import-design-from-url` using that download URL → creates a new editable design (the duplicate)
c. Note the new `design_id` for the duplicate

#### Step 2 — Read the design structure

a. `get-design-content` on the new design → returns all text elements (richtexts) with their content
b. Map text elements to CV sections by content matching:
   - Look for the candidate's name → header section
   - Look for "Summary" or "Professional Summary" → summary section
   - Look for company names from cv.md → experience sections
   - Look for degree/school names → education section
   - Look for skill keywords → skills section
c. If mapping fails, show the user what was found and ask for guidance

#### Step 3 — Generate tailored content

Same content generation as the HTML flow (Steps 1-11 above):
- Rewrite Professional Summary with JD keywords + exit narrative
- Reorder experience bullets by JD relevance
- Select top competencies from JD requirements
- Inject keywords naturally (NEVER invent)

**IMPORTANT — Character budget rule:** Each replacement text MUST be approximately the same length as the original text it replaces (within ±15% character count). If tailored content is longer, condense it. The Canva design has fixed-size text boxes — longer text causes overlapping with adjacent elements. Count the characters in each original element from Step 2 and enforce this budget when generating replacements.

#### Step 4 — Apply edits

a. `start-editing-transaction` on the duplicate design
b. `perform-editing-operations` with `find_and_replace_text` for each section:
   - Replace summary text with tailored summary
   - Replace each experience bullet with reordered/rewritten bullets
   - Replace competency/skills text with JD-matched terms
   - Replace project descriptions with top relevant projects
c. **Reflow layout after text replacement:**
   After applying all text replacements, the text boxes auto-resize but neighboring elements stay in place. This causes uneven spacing between work experience sections. Fix this:
   1. Read the updated element positions and dimensions from the `perform-editing-operations` response
   2. For each work experience section (top to bottom), calculate where the bullets text box ends: `end_y = top + height`
   3. The next section's header should start at `end_y + consistent_gap` (use the original gap from the template, typically ~30px)
   4. Use `position_element` to move the next section's date, company name, role title, and bullets elements to maintain even spacing
   5. Repeat for all work experience sections
d. **Verify layout before commit:**
   - `get-design-thumbnail` with the transaction_id and page_index=1
   - Visually inspect the thumbnail for: text overlapping, uneven spacing, text cut off, text too small
   - If issues remain, adjust with `position_element`, `resize_element`, or `format_text`
   - Repeat until layout is clean
e. Show the user the final preview and ask for approval
f. `commit-editing-transaction` to save (ONLY after user approval)

#### Step 5 — Export and download PDF

a. `export-design` the duplicate as PDF (format: a4 or letter based on JD location)
b. **IMMEDIATELY** download the PDF using Bash:
   ```bash
   curl -sL -o "output/cv-{candidate}-{company}-canva-{YYYY-MM-DD}.pdf" "{download_url}"
   ```
   The export URL is a pre-signed S3 link that expires in ~2 hours. Download it right away.
c. Verify the download:
   ```bash
   file output/cv-{candidate}-{company}-canva-{YYYY-MM-DD}.pdf
   ```
   Must show "PDF document". If it shows XML or HTML, the URL expired — re-export and retry.
d. Report: PDF path, file size, Canva design URL (for manual tweaking)

#### Error handling

- If `import-design-from-url` fails → fall back to HTML/PDF pipeline with message
- If text elements can't be mapped → warn user, show what was found, ask for manual mapping
- If `find_and_replace_text` finds no matches → try broader substring matching
- Always provide the Canva design URL so the user can edit manually if auto-edit fails

## Post-generation

Update tracker if the job is already registered: change PDF from ❌ to ✅.
