"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Download, CheckCircle, AlertCircle, Loader2, Settings2, FileDown, ZapIcon } from "lucide-react";
import { formatBytes, getSavingsPct, type ToolSlug, TOOL_CONFIG } from "@/lib/utils";
import { toast } from "sonner";


interface FileItem {
  id: string;
  file: File;
  status: "idle" | "converting" | "done" | "error";
  preview?: string;
  outputUrl?: string;
  outputSize?: number;
  error?: string;
}

interface ConverterProps {
  tool: ToolSlug;
}

export function Converter({ tool }: ConverterProps) {
  const config = TOOL_CONFIG[tool];
  const [files, setFiles] = useState<FileItem[]>([]);
  const [quality, setQuality] = useState(85);
  const [showSettings, setShowSettings] = useState(false);

  const isImage = !tool.startsWith("pdf");
  const showQuality = ["image-to-webp", "webp-to-jpg", "webp-to-png", "heic-to-jpg"].includes(tool);

  const onDrop = useCallback((accepted: File[]) => {
    const newItems: FileItem[] = accepted.slice(0, 20).map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      status: "idle",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    setFiles(prev => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: config.accept as unknown as Record<string, string[]>,
    maxSize: 50 * 1024 * 1024,
    maxFiles: 20,
    onDropRejected: () => toast.error("File rejected — check format or size (max 50MB)"),
  });

  const convertFile = async (item: FileItem) => {
    setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "converting" } : f));
    try {
      const fd = new FormData();
      fd.append("file", item.file);
      fd.append("tool", tool);
      fd.append("quality", quality.toString());

      const endpoint = (tool.startsWith("pdf") || tool === "image-to-pdf") ? "/api/pdf" : "/api/convert";
      const res = await fetch(endpoint, { method: "POST", body: fd });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Conversion failed" }));
        throw new Error(err.error || "Conversion failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setFiles(prev => prev.map(f =>
        f.id === item.id ? { ...f, status: "done", outputUrl: url, outputSize: blob.size } : f
      ));
      toast.success(`Converted: ${item.file.name}`);
    } catch (err: any) {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "error", error: err.message } : f));
      toast.error(err.message || "Conversion failed");
    }
  };

  const convertAll = () => {
    files.filter(f => f.status === "idle").forEach(convertFile);
  };

  const downloadFile = (item: FileItem) => {
    if (!item.outputUrl) return;
    const a = document.createElement("a");
    a.href = item.outputUrl;
    a.download = item.file.name.replace(/\.[^.]+$/, config.outputExt);
    a.click();
  };

  const downloadAll = async () => {
    const done = files.filter(f => f.status === "done" && f.outputUrl);
    if (done.length === 0) return;
    if (done.length === 1) { downloadFile(done[0]); return; }

    try {

      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const item of done) {
        const res = await fetch(item.outputUrl!);
        const blob = await res.blob();
        zip.file(item.file.name.replace(/\.[^.]+$/, config.outputExt), blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `swiftconvert-${tool}.zip`;
      a.click();
    } catch { toast.error("Could not create ZIP"); }
  };

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));
  const clearAll = () => setFiles([]);

  const doneCount = files.filter(f => f.status === "done").length;
  const idleCount = files.filter(f => f.status === "idle").length;
  const convertingCount = files.filter(f => f.status === "converting").length;

  return (
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, minHeight: 36 }}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-3)", fontSize: 13, padding: 0 }}>
          <Settings2 size={14} />
          Settings {showSettings ? "▲" : "▼"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {doneCount > 1 && (
            <button onClick={downloadAll} className="btn-ghost" style={{ fontSize: 13, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <FileDown size={14} /> Download all ({doneCount})
            </button>
          )}
          {idleCount > 0 && (
            <button onClick={convertAll} className="btn-primary" style={{ fontSize: 13, padding: "6px 14px" }}>
              <ZapIcon size={14} /> Convert {idleCount > 1 ? `all (${idleCount})` : ""}
            </button>
          )}
          {files.length > 0 && (
            <button onClick={clearAll} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-3)" }}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && showQuality && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 12 }}>
            <div className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, color: "var(--color-text-2)", whiteSpace: "nowrap" }}>Quality</span>
                <input type="range" min={1} max={100} value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--color-brand)" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-brand)", minWidth: 36 }}>{quality}%</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--color-text-3)", marginTop: 8 }}>
                85% recommended — great balance of quality and file size.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone */}
      <div {...getRootProps()} className={`dropzone${isDragActive ? " active" : ""}`}
        style={{ padding: "56px 32px", textAlign: "center", marginBottom: 16 }}>
        <input {...getInputProps()} />
        <motion.div animate={isDragActive ? { scale: 1.04 } : { scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: isDragActive ? "rgba(0,208,132,0.15)" : "rgba(0,208,132,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s"
          }}>
            <Upload size={24} color={isDragActive ? "var(--color-brand)" : "var(--color-text-3)"} />
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--color-text-1)", marginBottom: 6 }}>
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p style={{ fontSize: 13, color: "var(--color-text-3)" }}>
            or <span style={{ color: "var(--color-brand)", cursor: "pointer" }}>browse files</span> — up to 20 files, 50MB each
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginTop: 16 }}>
            {Object.values(config.accept).flat().map(ext => (
              <span key={ext} className="tag">{ext.replace(".", "")}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {files.map((item, i) => {
              const savings = item.outputSize ? getSavingsPct(item.file.size, item.outputSize) : null;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.02 }}
                  className="card"
                  style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>

                  {/* Thumb */}
                  {item.preview ? (
                    <img src={item.preview} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--color-bg-4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                      {config.icon}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.file.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
                      <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>{formatBytes(item.file.size)}</span>
                      {item.outputSize && (
                        <>
                          <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>→</span>
                          <span style={{ fontSize: 12, color: "#34D399" }}>{formatBytes(item.outputSize)}</span>
                          {savings && Number(savings) > 0 && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#34D399", background: "rgba(52,211,153,0.12)", padding: "2px 7px", borderRadius: 99 }}>
                              -{savings}%
                            </span>
                          )}
                        </>
                      )}
                      {item.error && <span style={{ fontSize: 12, color: "#F87171" }}>{item.error}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {item.status === "idle" && (
                      <button onClick={() => convertFile(item)} className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }}>
                        Convert
                      </button>
                    )}
                    {item.status === "converting" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-3)" }}>
                        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                        Converting…
                      </div>
                    )}
                    {item.status === "done" && (
                      <>
                        <CheckCircle size={16} color="#34D399" />
                        <button onClick={() => downloadFile(item)} className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                          <Download size={13} /> Download
                        </button>
                      </>
                    )}
                    {item.status === "error" && (
                      <>
                        <AlertCircle size={16} color="#F87171" />
                        <button onClick={() => convertFile(item)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#F87171" }}>
                          Retry
                        </button>
                      </>
                    )}
                    <button onClick={() => removeFile(item.id)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-3)", padding: 4, display: "flex" }}>
                      <X size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Spinner style */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
