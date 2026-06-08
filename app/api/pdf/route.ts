import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const tool = fd.get("tool") as string;
    const files = fd.getAll("file") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // ── Image → PDF ──────────────────────────────────────────
    if (tool === "image-to-pdf") {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const buf = Buffer.from(await file.arrayBuffer());

        // Convert to PNG via sharp (pdf-lib handles jpg/png)
        const pngBuf = await sharp(buf).png().toBuffer();
        const img = await pdfDoc.embedPng(pngBuf);
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const pdfBytes = await pdfDoc.save();
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="converted.pdf"',
          "Cache-Control": "no-store",
        },
      });
    }
    // ── PDF Merge ─────────────────────────────────────────────
    if (tool === "pdf-merge") {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const buf = Buffer.from(await file.arrayBuffer());
        const src = await PDFDocument.load(buf);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="merged.pdf"',
          "Cache-Control": "no-store",
        },
      });
    }

    // ── PDF Compress ──────────────────────────────────────────
    if (tool === "pdf-compress") {
      const file = files[0];
      const buf = Buffer.from(await file.arrayBuffer());
      // pdf-lib re-save removes redundant metadata and compresses streams
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="compressed.pdf"',
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json({ error: "Unknown PDF tool" }, { status: 400 });
  } catch (err: any) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: "PDF processing failed." }, { status: 500 });
  }
}
