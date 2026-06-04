/**
 * PDF to Word Conversion Engine
 * 
 * Extracts text from PDF with positioning, font, and layout information,
 * then generates a formatted Word document preserving structure.
 */

// ── Types ──────────────────────────────────────────────────────────────────

interface ExtractedTextItem {
  str: string;
  transform: number[];
  fontName: string;
  height: number;
  width: number;
}

interface PositionedItem {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
  fontFamily: string;
  width: number;
}

interface ReconstructedLine {
  items: PositionedItem[];
  y: number;
  text: string;
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
  fontFamily: string;
  x: number;
}

interface PageData {
  lines: ReconstructedLine[];
  width: number;
  height: number;
  pageNumber: number;
}

type ProgressCallback = (progress: number, message: string) => void;

// ── Font Detection ─────────────────────────────────────────────────────────

const BOLD_PATTERNS = /Bold|bold|\bBd\b|Heavy|Black|Demi|Semi.*Bold/i;
const ITALIC_PATTERNS = /Italic|italic|Oblique|\bIt\b/i;

const FONT_MAP: Record<string, string> = {
  times: 'Times New Roman',
  timesnewroman: 'Times New Roman',
  arial: 'Arial',
  helvetica: 'Arial',
  courier: 'Courier New',
  couriernew: 'Courier New',
  georgia: 'Georgia',
  verdana: 'Verdana',
  tahoma: 'Tahoma',
  trebuchet: 'Trebuchet MS',
  palatino: 'Palatino Linotype',
  garamond: 'Garamond',
  cambria: 'Cambria',
  calibri: 'Calibri',
  consolas: 'Consolas',
  lucida: 'Lucida Sans',
};

function detectBold(fontName: string): boolean {
  return BOLD_PATTERNS.test(fontName);
}

function detectItalic(fontName: string): boolean {
  return ITALIC_PATTERNS.test(fontName);
}

function extractFontFamily(fontName: string): string {
  // Remove common prefixes like "AAAAAB+" that PDF embeds add
  let cleaned = fontName.replace(/^[A-Z]{6}\+/, '');
  // Remove style suffixes
  cleaned = cleaned.replace(/[-,](Bold|Italic|Oblique|Regular|Medium|Light|Heavy|Black|Thin|Bd|It|Rg|Lt|Md|Bk|Semibold|Demi|Extra|Ultra|Condensed|Narrow|Expanded|Wide)/gi, '');
  // Remove trailing hyphens/commas
  cleaned = cleaned.replace(/[-,]+$/, '');
  
  // Try to match against known fonts
  const lowerCleaned = cleaned.toLowerCase().replace(/[\s-_]/g, '');
  for (const [key, value] of Object.entries(FONT_MAP)) {
    if (lowerCleaned.includes(key)) {
      return value;
    }
  }
  
  // If we have a reasonable name, use it; otherwise default
  if (cleaned.length > 1 && cleaned.length < 50) {
    return cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  return 'Calibri';
}

// ── Text Extraction & Line Reconstruction ──────────────────────────────────

function extractPositionedItems(items: ExtractedTextItem[]): PositionedItem[] {
  return items
    .filter(item => item.str.length > 0)
    .map(item => {
      const fontSize = Math.abs(item.transform[3]) || item.height || 12;
      return {
        text: item.str,
        x: item.transform[4],
        y: item.transform[5],
        fontSize,
        fontName: item.fontName,
        isBold: detectBold(item.fontName),
        isItalic: detectItalic(item.fontName),
        fontFamily: extractFontFamily(item.fontName),
        width: item.width,
      };
    });
}

function groupIntoLines(items: PositionedItem[], yTolerance: number = 2): ReconstructedLine[] {
  if (items.length === 0) return [];

  // Sort by Y descending (PDF coordinates: bottom-up), then X ascending
  const sorted = [...items].sort((a, b) => {
    if (Math.abs(a.y - b.y) > yTolerance) return b.y - a.y;
    return a.x - b.x;
  });

  const lines: ReconstructedLine[] = [];
  let currentLine: PositionedItem[] = [sorted[0]];
  let currentY = sorted[0].y;

  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i];
    if (Math.abs(item.y - currentY) <= yTolerance) {
      currentLine.push(item);
    } else {
      lines.push(buildLine(currentLine));
      currentLine = [item];
      currentY = item.y;
    }
  }
  if (currentLine.length > 0) {
    lines.push(buildLine(currentLine));
  }

  return lines;
}

function buildLine(items: PositionedItem[]): ReconstructedLine {
  // Sort items left to right
  items.sort((a, b) => a.x - b.x);

  // Join text with appropriate spacing
  let text = '';
  for (let i = 0; i < items.length; i++) {
    if (i > 0) {
      const prevEnd = items[i - 1].x + items[i - 1].width;
      const gap = items[i].x - prevEnd;
      const avgCharWidth = items[i - 1].width / Math.max(items[i - 1].text.length, 1);
      if (gap > avgCharWidth * 0.3) {
        text += ' ';
      }
    }
    text += items[i].text;
  }

  const dominantItem = getDominantItem(items);

  return {
    items,
    y: items[0].y,
    text: text.trim(),
    fontSize: dominantItem.fontSize,
    fontName: dominantItem.fontName,
    isBold: dominantItem.isBold,
    isItalic: dominantItem.isItalic,
    fontFamily: dominantItem.fontFamily,
    x: items[0].x,
  };
}

function getDominantItem(items: PositionedItem[]): PositionedItem {
  let maxLen = 0;
  let dominant = items[0];
  for (const item of items) {
    if (item.text.length > maxLen) {
      maxLen = item.text.length;
      dominant = item;
    }
  }
  return dominant;
}

// ── Layout Analysis ────────────────────────────────────────────────────────

function calculateBodyFontSize(allPages: PageData[]): number {
  const sizeCounts = new Map<number, number>();
  for (const page of allPages) {
    for (const line of page.lines) {
      if (line.text.trim().length === 0) continue;
      const rounded = Math.round(line.fontSize * 2) / 2;
      const textLen = line.text.length;
      sizeCounts.set(rounded, (sizeCounts.get(rounded) || 0) + textLen);
    }
  }

  if (sizeCounts.size === 0) return 12;

  let maxCount = 0;
  let modeSize = 12;
  for (const [size, count] of sizeCounts) {
    if (count > maxCount) {
      maxCount = count;
      modeSize = size;
    }
  }
  return modeSize;
}

function detectHeadingLevel(fontSize: number, bodySize: number): number | null {
  if (bodySize <= 0) return null;
  const ratio = fontSize / bodySize;
  if (ratio >= 1.8) return 1;
  if (ratio >= 1.3) return 2;
  return null;
}

function calculateAverageLineHeight(lines: ReconstructedLine[]): number {
  if (lines.length < 2) return 14;
  const gaps: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const gap = Math.abs(lines[i - 1].y - lines[i].y);
    if (gap > 0 && gap < 200) {
      gaps.push(gap);
    }
  }
  if (gaps.length === 0) return 14;
  return gaps.reduce((a, b) => a + b, 0) / gaps.length;
}

function calculateLeftMargin(lines: ReconstructedLine[]): number {
  if (lines.length === 0) return 0;
  const xCounts = new Map<number, number>();
  for (const line of lines) {
    if (line.text.trim().length === 0) continue;
    const rounded = Math.round(line.x / 5) * 5;
    xCounts.set(rounded, (xCounts.get(rounded) || 0) + 1);
  }
  let maxCount = 0;
  let margin = 0;
  for (const [x, count] of xCounts) {
    if (count > maxCount) {
      maxCount = count;
      margin = x;
    }
  }
  return margin;
}

// ── Word Document Generation ───────────────────────────────────────────────

export async function convertPdfToWord(
  arrayBuffer: ArrayBuffer,
  onProgress: ProgressCallback
): Promise<{ blob: Blob; pageCount: number; textPreview: string }> {
  
  onProgress(5, 'Loading PDF engine...');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  onProgress(10, 'Parsing PDF document...');
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  // ── Phase 1: Extract all page data ──
  const allPages: PageData[] = [];
  const allTextParts: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const progressPct = 10 + Math.round((i / totalPages) * 40);
    onProgress(progressPct, `Extracting page ${i} of ${totalPages}...`);

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();

    // Filter to actual text items (not markers) using runtime checks
    const textItems: ExtractedTextItem[] = [];
    for (const item of textContent.items) {
      if ('str' in item && 'transform' in item) {
        const ti = item as unknown as ExtractedTextItem;
        textItems.push(ti);
      }
    }

    const positioned = extractPositionedItems(textItems);
    const lines = groupIntoLines(positioned);

    allPages.push({
      lines,
      width: viewport.width,
      height: viewport.height,
      pageNumber: i,
    });

    const pageText = lines.map(l => l.text).join('\n');
    allTextParts.push(pageText);
  }

  const allText = allTextParts.join('\n\n');
  if (allText.trim().length === 0) {
    throw new Error(
      'No extractable text found in this PDF. It may be a scanned document containing only images. Try an OCR tool first.'
    );
  }

  // ── Phase 2: Analyze document layout ──
  onProgress(55, 'Analyzing document layout...');
  const bodyFontSize = calculateBodyFontSize(allPages);

  // ── Phase 3: Generate Word document ──
  onProgress(60, 'Generating Word document...');
  const docx = await import('docx');
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    SectionType,
    convertInchesToTwip,
  } = docx;

  const sections = allPages.map((pageData, pageIndex) => {
    const progressPct = 60 + Math.round(((pageIndex + 1) / totalPages) * 30);
    onProgress(progressPct, `Formatting page ${pageIndex + 1} of ${totalPages}...`);

    const { lines, width, height } = pageData;
    const avgLineHeight = calculateAverageLineHeight(lines);
    const leftMargin = calculateLeftMargin(lines);
    const paragraphBreakThreshold = avgLineHeight * 1.5;
    const indentThreshold = 20;

    // Convert PDF points to twips (1 point = 20 twips)
    const pageWidthTwips = Math.round(width * 20);
    const pageHeightTwips = Math.round(height * 20);
    const marginTwips = convertInchesToTwip(1);

    const children: InstanceType<typeof Paragraph>[] = [];
    let currentParagraphRuns: InstanceType<typeof TextRun>[] = [];
    let currentHeadingLevel: (typeof HeadingLevel)[keyof typeof HeadingLevel] | null = null;
    let currentIndent = 0;
    let currentSpacingBefore = 0;

    function flushParagraph() {
      if (currentParagraphRuns.length === 0) return;

      const paragraphOptions: Record<string, unknown> = {
        children: currentParagraphRuns,
        spacing: {
          after: 120,
          before: currentSpacingBefore,
        },
      };

      if (currentHeadingLevel !== null) {
        paragraphOptions.heading = currentHeadingLevel;
      }

      if (currentIndent > 0) {
        paragraphOptions.indent = {
          left: Math.round(currentIndent * 20),
        };
      }

      children.push(new Paragraph(paragraphOptions));
      currentParagraphRuns = [];
      currentHeadingLevel = null;
      currentIndent = 0;
      currentSpacingBefore = 0;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.text.trim().length === 0) continue;

      // Detect paragraph break (large Y gap from previous line)
      const isParagraphBreak = i > 0 && (() => {
        const prevLine = lines[i - 1];
        const yGap = Math.abs(prevLine.y - line.y);
        return yGap > paragraphBreakThreshold;
      })();

      // Detect heading
      const headingLevel = detectHeadingLevel(line.fontSize, bodyFontSize);

      // Detect indentation
      const indentFromMargin = line.x - leftMargin;
      const hasIndent = indentFromMargin > indentThreshold;

      // Start new paragraph on: paragraph break, heading change, or first line
      if (isParagraphBreak || headingLevel !== null || (i === 0)) {
        flushParagraph();
        
        if (headingLevel === 1) {
          currentHeadingLevel = HeadingLevel.HEADING_1;
        } else if (headingLevel === 2) {
          currentHeadingLevel = HeadingLevel.HEADING_2;
        }

        if (hasIndent) {
          currentIndent = indentFromMargin;
        }

        if (isParagraphBreak) {
          currentSpacingBefore = 200;
        }
      } else if (currentParagraphRuns.length > 0) {
        // Same paragraph, add a space before appending this line
        currentParagraphRuns.push(new TextRun({ text: ' ' }));
      }

      // Build text runs for this line, preserving per-item font styles
      for (const item of line.items) {
        if (item.text.trim().length === 0 && item.text.length > 0) {
          currentParagraphRuns.push(new TextRun({ text: ' ' }));
          continue;
        }
        if (item.text.length === 0) continue;

        const fontSizeHalfPts = Math.round(item.fontSize * 2);
        currentParagraphRuns.push(
          new TextRun({
            text: item.text,
            font: item.fontFamily,
            size: fontSizeHalfPts > 0 ? fontSizeHalfPts : 24,
            bold: item.isBold,
            italics: item.isItalic,
          })
        );
      }
    }

    // Flush remaining paragraph
    flushParagraph();

    // If page produced no content, add an empty paragraph
    if (children.length === 0) {
      children.push(new Paragraph({ text: '' }));
    }

    return {
      properties: {
        type: pageIndex > 0 ? SectionType.NEXT_PAGE : undefined,
        page: {
          size: {
            width: pageWidthTwips,
            height: pageHeightTwips,
          },
          margin: {
            top: marginTwips,
            right: marginTwips,
            bottom: marginTwips,
            left: marginTwips,
          },
        },
      },
      children,
    };
  });

  onProgress(92, 'Packaging .docx file...');

  const doc = new Document({
    sections,
  });

  const blob = await Packer.toBlob(doc);

  const textPreview = allText.substring(0, 500) + (allText.length > 500 ? '...' : '');

  return {
    blob,
    pageCount: totalPages,
    textPreview,
  };
}
