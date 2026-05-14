import { execFile } from "child_process";
import { mkdir, readdir } from "fs/promises";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
const SLIDES_ROOT = path.join(UPLOADS_ROOT, "slides");

export interface RenderedSlide {
  order: number;
  imagePath: string; // relative: uploads/slides/[presentationId]/slide-XX.png
}

export async function renderPdf(
  pdfAbsPath: string,
  presentationId: string
): Promise<RenderedSlide[]> {
  // Validate inputs contain no shell-unsafe characters
  if (!/^[a-zA-Z0-9_\-/.]+$/.test(pdfAbsPath)) {
    throw new Error("Unsafe PDF path");
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(presentationId)) {
    throw new Error("Unsafe presentationId");
  }

  const outDir = path.join(SLIDES_ROOT, presentationId);
  await mkdir(outDir, { recursive: true });

  // Render all pages: pdftoppm outputs slide-1.png, slide-2.png, …
  const prefix = path.join(outDir, "slide");
  await execFileAsync("pdftoppm", ["-r", "150", "-png", pdfAbsPath, prefix]);

  // Collect and sort output files
  const files = (await readdir(outDir))
    .filter((f) => f.endsWith(".png"))
    .sort(); // lexicographic sort works because pdftoppm zero-pads

  if (files.length === 0) {
    throw new Error("pdftoppm produced no output files");
  }

  return files.map((filename, i) => ({
    order: i + 1,
    imagePath: `uploads/slides/${presentationId}/${filename}`,
  }));
}
