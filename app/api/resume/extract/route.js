import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const PYTHON_BIN = "/Users/priyanshagrawal/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";

const PYTHON_EXTRACTOR = `
import json
import pathlib
import sys

file_path = pathlib.Path(sys.argv[1])
suffix = file_path.suffix.lower()
text = ""

if suffix == ".pdf":
    from pypdf import PdfReader
    reader = PdfReader(str(file_path))
    parts = []
    for page in reader.pages:
        parts.append(page.extract_text() or "")
    text = "\\n".join(parts)
elif suffix == ".docx":
    import docx
    document = docx.Document(str(file_path))
    text = "\\n".join(paragraph.text for paragraph in document.paragraphs)
else:
    text = file_path.read_text(errors="ignore")

print(json.dumps({"text": text}))
`;

export async function POST(request) {
  let tempDir = "";

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    const safeName = String(file.name || "resume.txt").replace(/[^a-zA-Z0-9._-]/g, "_");
    tempDir = await mkdtemp(path.join(os.tmpdir(), "yuva-resume-"));
    const filePath = path.join(tempDir, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const { stdout } = await execFileAsync(PYTHON_BIN, ["-c", PYTHON_EXTRACTOR, filePath], {
      maxBuffer: 10 * 1024 * 1024,
      timeout: 20000,
    });
    const parsed = JSON.parse(stdout || "{}");
    const text = String(parsed.text || "").trim();

    if (!text) {
      return NextResponse.json(
        { error: "Could not extract readable text from this resume. If it is scanned, paste the text manually." },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("Resume extraction failed:", error);
    return NextResponse.json(
      { error: "Could not extract this resume. Paste the resume text manually or try a text-based PDF/DOCX." },
      { status: 500 }
    );
  } finally {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
