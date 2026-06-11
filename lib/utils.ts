import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

export function getSavingsPct(original: number, converted: number): string {
  if (original === 0) return "0";
  return ((1 - converted / original) * 100).toFixed(1);
}

export const TOOL_CONFIG = {
  "image-to-webp": {
    slug: "image-to-webp",
    title: "Image to WebP",
    description: "Convert JPG, PNG, GIF, BMP, TIFF to WebP format",
    longDesc:
      "Convert any image to WebP format and reduce file size by up to 80% without losing quality. WebP is the modern image format supported by all browsers.",
    keywords: ["image to webp", "jpg to webp", "png to webp", "convert to webp free"],
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
      "image/tiff": [".tiff", ".tif"],
      "image/avif": [".avif"],
    },
    outputExt: ".webp",
    outputMime: "image/webp",
    icon: "🖼️",
    color: "#00D084",
  },
  "webp-to-jpg": {
    slug: "webp-to-jpg",
    title: "WebP to JPG",
    description: "Convert WebP images back to JPG format",
    longDesc:
      "Need JPG compatibility? Convert WebP images to JPG instantly — perfect for apps and platforms that don't yet support WebP.",
    keywords: ["webp to jpg", "convert webp to jpeg", "webp to jpg online free"],
    accept: { "image/webp": [".webp"] },
    outputExt: ".jpg",
    outputMime: "image/jpeg",
    icon: "🔄",
    color: "#00B8E0",
  },
  "webp-to-png": {
    slug: "webp-to-png",
    title: "WebP to PNG",
    description: "Convert WebP images to PNG with transparency",
    longDesc:
      "Convert WebP to PNG and preserve transparency. PNG is the go-to format for graphics with transparent backgrounds.",
    keywords: ["webp to png", "convert webp to png online", "webp png converter"],
    accept: { "image/webp": [".webp"] },
    outputExt: ".png",
    outputMime: "image/png",
    icon: "🔁",
    color: "#A78BFA",
  },
  "heic-to-jpg": {
    slug: "heic-to-jpg",
    title: "HEIC to JPG",
    description: "Convert iPhone HEIC photos to JPG",
    longDesc:
      "Convert iPhone and iOS HEIC photos to universally compatible JPG format. Works on any device — no software needed.",
    keywords: ["heic to jpg", "heic to jpeg converter", "iphone heic to jpg online free"],
    accept: { "image/heic": [".heic", ".heif"] },
    outputExt: ".jpg",
    outputMime: "image/jpeg",
    icon: "📱",
    color: "#F59E0B",
  },
  "image-to-pdf": {
    slug: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert JPG, PNG images to PDF documents",
    longDesc:
      "Turn one or multiple images into a single PDF document. Perfect for sharing, printing, or archiving photos and scans.",
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert image to pdf free online"],
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    outputExt: ".pdf",
    outputMime: "application/pdf",
    icon: "📄",
    color: "#F43F5E",
  },
  "pdf-merge": {
    slug: "pdf-merge",
    title: "PDF Merge",
    description: "Combine multiple PDFs into one file",
    longDesc:
      "Merge multiple PDF files into one document in seconds. Drag to reorder pages, then download the combined PDF.",
    keywords: ["merge pdf", "combine pdf files", "pdf merger online free", "join pdf"],
    accept: { "application/pdf": [".pdf"] },
    outputExt: ".pdf",
    outputMime: "application/pdf",
    icon: "🔗",
    color: "#6366F1",
  },
  "pdf-compress": {
    slug: "pdf-compress",
    title: "PDF Compress",
    description: "Reduce PDF file size without quality loss",
    longDesc:
      "Compress PDF files to reduce their size for easy sharing via email or upload. No quality loss on text and vector content.",
    keywords: ["compress pdf", "reduce pdf size", "pdf compressor online free", "shrink pdf"],
    accept: { "application/pdf": [".pdf"] },
    outputExt: ".pdf",
    outputMime: "application/pdf",
    icon: "⚡",
    color: "#EC4899",
  },
  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert PDF pages to JPG images",
    longDesc:
      "Extract pages from any PDF and convert them to high quality JPG images. Perfect for presentations, thumbnails, and previews.",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg online free"],
    accept: { "application/pdf": [".pdf"] },
    outputExt: ".jpg",
    outputMime: "image/jpeg",
    icon: "🖼️",
    color: "#F59E0B",
  },
} as const;

export type ToolSlug = keyof typeof TOOL_CONFIG;

// Input format se valid output tools — uploaded format exclude
export const FORMAT_OUTPUT_MAP: Record<string, ToolSlug[]> = {
  "image/jpeg":      ["image-to-webp", "webp-to-png", "image-to-pdf"],
  "image/jpg":       ["image-to-webp", "webp-to-png", "image-to-pdf"],
  "image/png":       ["image-to-webp", "webp-to-jpg", "image-to-pdf"],
  "image/gif":       ["image-to-webp", "webp-to-jpg", "webp-to-png", "image-to-pdf"],
  "image/bmp":       ["image-to-webp", "webp-to-jpg", "webp-to-png", "image-to-pdf"],
  "image/tiff":      ["image-to-webp", "webp-to-jpg", "webp-to-png", "image-to-pdf"],
  "image/avif":      ["image-to-webp", "webp-to-jpg", "webp-to-png", "image-to-pdf"],
  "image/webp":      ["webp-to-jpg", "webp-to-png", "image-to-pdf"],
  "image/heic":      ["heic-to-jpg", "image-to-webp", "webp-to-png", "image-to-pdf"],
  "image/heif":      ["heic-to-jpg", "image-to-webp", "webp-to-png", "image-to-pdf"],
  "application/pdf": ["pdf-merge", "pdf-compress", "pdf-to-jpg"],
};