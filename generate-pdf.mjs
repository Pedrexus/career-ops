#!/usr/bin/env node

/**
 * generate-pdf.mjs — HTML → PDF via Playwright
 *
 * Usage:
 *   node career-ops/generate-pdf.mjs <input.html> <output.pdf> [--format=letter|a4] [--max-pages=1]
 *
 * Requires: @playwright/test (or playwright) installed.
 * Uses Chromium headless to render the HTML and produce a clean, ATS-parseable PDF.
 */

import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { readFile } from 'fs/promises';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ensure output directory exists (fresh setup)
mkdirSync(resolve(__dirname, 'output'), { recursive: true });

/**
 * Normalize text for ATS compatibility by converting problematic Unicode.
 *
 * ATS parsers and legacy systems often fail on em-dashes, smart quotes,
 * zero-width characters, and non-breaking spaces. These cause mojibake,
 * parsing errors, or display issues. See issue #1.
 *
 * Only touches body text — preserves CSS, JS, tag attributes, and URLs.
 * Returns { html, replacements } so the caller can log what was changed.
 */
function normalizeTextForATS(html) {
  const replacements = {};
  const bump = (key, n) => { replacements[key] = (replacements[key] || 0) + n; };

  const masks = [];
  const masked = html.replace(
    /<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi,
    (match) => {
      const token = `\u0000MASK${masks.length}\u0000`;
      masks.push(match);
      return token;
    }
  );

  let out = '';
  let i = 0;
  while (i < masked.length) {
    const lt = masked.indexOf('<', i);
    if (lt === -1) { out += sanitizeText(masked.slice(i)); break; }
    out += sanitizeText(masked.slice(i, lt));
    const gt = masked.indexOf('>', lt);
    if (gt === -1) { out += masked.slice(lt); break; }
    out += masked.slice(lt, gt + 1);
    i = gt + 1;
  }

  const restored = out.replace(/\u0000MASK(\d+)\u0000/g, (_, n) => masks[Number(n)]);
  return { html: restored, replacements };

  function sanitizeText(text) {
    if (!text) return text;
    let t = text;
    t = t.replace(/\u2014/g, () => { bump('em-dash', 1); return '-'; });
    t = t.replace(/\u2013/g, () => { bump('en-dash', 1); return '-'; });
    t = t.replace(/[\u201C\u201D\u201E\u201F]/g, () => { bump('smart-double-quote', 1); return '"'; });
    t = t.replace(/[\u2018\u2019\u201A\u201B]/g, () => { bump('smart-single-quote', 1); return "'"; });
    t = t.replace(/\u2026/g, () => { bump('ellipsis', 1); return '...'; });
    t = t.replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, () => { bump('zero-width', 1); return ''; });
    t = t.replace(/\u00A0/g, () => { bump('nbsp', 1); return ' '; });
    return t;
  }
}

async function generatePDF() {
  const args = process.argv.slice(2);

  // Parse arguments
  let inputPath, outputPath, format = 'a4';
  let maxPages = Number.parseInt(process.env.CV_MAX_PAGES || '1', 10);
  let requestedScale = null;
  let allowOverflow = false;

  for (const arg of args) {
    if (arg.startsWith('--format=')) {
      format = arg.split('=')[1].toLowerCase();
    } else if (arg.startsWith('--max-pages=')) {
      maxPages = Number.parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--scale=')) {
      requestedScale = Number.parseFloat(arg.split('=')[1]);
    } else if (arg === '--allow-overflow') {
      allowOverflow = true;
    } else if (!inputPath) {
      inputPath = arg;
    } else if (!outputPath) {
      outputPath = arg;
    }
  }

  if (!inputPath || !outputPath) {
    console.error('Usage: node generate-pdf.mjs <input.html> <output.pdf> [--format=letter|a4] [--max-pages=1] [--scale=1]');
    process.exit(1);
  }

  inputPath = resolve(inputPath);
  outputPath = resolve(outputPath);

  // Validate format
  const validFormats = ['a4', 'letter'];
  if (!validFormats.includes(format)) {
    console.error(`Invalid format "${format}". Use: ${validFormats.join(', ')}`);
    process.exit(1);
  }
  if (!Number.isInteger(maxPages) || maxPages < 1) {
    console.error('Invalid --max-pages value. Use a positive integer.');
    process.exit(1);
  }
  if (requestedScale != null && (!Number.isFinite(requestedScale) || requestedScale < 0.1 || requestedScale > 2)) {
    console.error('Invalid --scale value. Use a number from 0.1 to 2.');
    process.exit(1);
  }

  console.log(`📄 Input:  ${inputPath}`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📏 Format: ${format.toUpperCase()}`);
  console.log(`📐 Max pages: ${allowOverflow ? 'unlimited' : maxPages}`);

  // Read HTML to inject font paths as absolute file:// URLs
  let html = await readFile(inputPath, 'utf-8');

  // Resolve font paths relative to career-ops/fonts/
  const fontsDir = resolve(__dirname, 'fonts');
  html = html.replace(
    /url\(['"]?\.\/fonts\//g,
    `url('file://${fontsDir}/`
  );
  // Close any unclosed quotes from the replacement (handles all font formats)
  html = html.replace(
    /file:\/\/([^'")]+)\.(woff2?|ttf|otf)['"]?\)/g,
    `file://$1.$2')`
  );

  // Normalize text for ATS compatibility (issue #1)
  const normalized = normalizeTextForATS(html);
  html = normalized.html;
  const totalReplacements = Object.values(normalized.replacements).reduce((a, b) => a + b, 0);
  if (totalReplacements > 0) {
    const breakdown = Object.entries(normalized.replacements).map(([k, v]) => `${k}=${v}`).join(', ');
    console.log(`🧹 ATS normalization: ${totalReplacements} replacements (${breakdown})`);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();

    // Set content with file base URL for any relative resources
    await page.setContent(html, {
      waitUntil: 'networkidle',
      baseURL: `file://${dirname(inputPath)}/`,
    });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    const scaleCandidates = requestedScale == null
      ? [1, 0.96, 0.92, 0.88, 0.84, 0.80, 0.76]
      : [requestedScale];

    let selected = null;
    for (const scale of scaleCandidates) {
      const pdfBuffer = await page.pdf({
        format: format,
        printBackground: true,
        scale,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
        },
        preferCSSPageSize: false,
      });

      const pageCount = countPdfPages(pdfBuffer);
      selected = { pdfBuffer, pageCount, scale };
      if (allowOverflow || pageCount <= maxPages) break;
      console.log(`⚠️  Pages: ${pageCount} at scale ${scale}; retrying smaller`);
    }

    if (!allowOverflow && selected.pageCount > maxPages) {
      throw new Error(`Generated PDF is ${selected.pageCount} pages; limit is ${maxPages}. Trim CV content and retry.`);
    }

    // Write PDF
    const { writeFile } = await import('fs/promises');
    await writeFile(outputPath, selected.pdfBuffer);

    console.log(`✅ PDF generated: ${outputPath}`);
    console.log(`📊 Pages: ${selected.pageCount}`);
    console.log(`🔎 Scale: ${selected.scale}`);
    console.log(`📦 Size: ${(selected.pdfBuffer.length / 1024).toFixed(1)} KB`);

    return { outputPath, pageCount: selected.pageCount, size: selected.pdfBuffer.length };
  } finally {
    await browser.close();
  }
}

function countPdfPages(pdfBuffer) {
  const pdfString = pdfBuffer.toString('latin1');
  return (pdfString.match(/\/Type\s*\/Page\b/g) || []).length;
}

generatePDF().catch((err) => {
  console.error('❌ PDF generation failed:', err.message);
  process.exit(1);
});
