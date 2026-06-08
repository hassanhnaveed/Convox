import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe, Lock } from "lucide-react";
import { TOOL_CONFIG } from "@/lib/utils";
import { Converter } from "@/components/tools/Converter";

export const metadata: Metadata = {
  title: "SwiftConvert — Free Image & PDF Converter Online | No Limits",
  description:
    "Convert images to WebP, JPG, PDF. Merge & compress PDFs. 100% free, unlimited, no watermarks, no registration. Fast, private, browser-based.",
  alternates: { canonical: "/" },
};

const tools = Object.values(TOOL_CONFIG);

const whyItems = [
  { icon: Zap, title: "Lightning fast", desc: "Sharp-powered server processing. Most files convert in under a second." },
  { icon: Lock, title: "100% private", desc: "Files processed in memory and immediately discarded. Never stored." },
  { icon: Globe, title: "No limits", desc: "Convert unlimited files. No daily caps, no registration, no watermarks." },
  { icon: ShieldCheck, title: "Always free", desc: "Core tools are free forever. We may add optional paid features later." },
];

const faqs = [
  { q: "Is SwiftConvert really free?", a: "Yes — all current tools are completely free. No hidden fees, no credit card, no account required." },
  { q: "Are my files stored on your servers?", a: "No. Files are processed in memory and deleted immediately after conversion. We never store your data." },
  { q: "What is WebP and why should I use it?", a: "WebP is a modern image format by Google that provides 25–80% smaller files than JPG/PNG at the same quality — making your website load faster." },
  { q: "What browsers support WebP?", a: "All modern browsers — Chrome, Firefox, Safari 14+, Edge, Opera. WebP has 97%+ global support as of 2024." },
  { q: "What is the file size limit?", a: "50MB per file, up to 20 files at once. This covers the vast majority of use cases." },
  { q: "Can I convert multiple files at once?", a: "Yes! Upload up to 20 files, convert them all with one click, and download as a ZIP." },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 80, paddingBottom: 80 }}>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(0,208,132,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 200, right: -100, width: 400, height: 400, background: "radial-gradient(ellipse, rgba(0,184,224,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}>
            <div className="badge" style={{ marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-brand)", display: "inline-block" }} />
              Free · Unlimited · No watermarks
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2.5px",
              color: "#fff",
              marginBottom: 20,
            }}>
              Convert anything.<br />
              <span className="text-gradient">Instantly.</span>
            </h1>

            <p style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "var(--color-text-2)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 32px", fontWeight: 300 }}>
              Images to WebP, HEIC to JPG, PDF merge & compress — all the file tools you need. Free forever, no sign-up, no watermarks.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
              <Link href="/image-to-webp" className="btn-primary">
                Start Converting <ArrowRight size={16} />
              </Link>
              <Link href="#tools" className="btn-ghost">
                See all tools
              </Link>
            </div>
          </div>

          {/* Hero converter — image to webp as default demo */}
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Converter tool="image-to-webp" />
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            { val: "80%", label: "Avg. size saved" },
            { val: "7", label: "Conversion tools" },
            { val: "50MB", label: "Max file size" },
            { val: "0$", label: "Cost forever" },
          ].map(({ val, label }) => (
            <div key={label}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: "-1px", color: "var(--color-brand)" }}>{val}</p>
              <p style={{ fontSize: 12, color: "var(--color-text-3)", marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── All Tools ─────────────────────────────────────────── */}
      <section id="tools" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff", marginBottom: 12 }}>
              All conversion tools
            </h2>
            <p style={{ fontSize: 15, color: "var(--color-text-2)", maxWidth: 400, margin: "0 auto" }}>
              Everything you need in one place. Click any tool to get started.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {tools.map((tool, i) => (
              <Link key={tool.slug} href={`/${tool.slug}`} className="tool-card"
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${tool.color}15`,
                    border: `1px solid ${tool.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>
                    {tool.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--color-text-1)", marginBottom: 4 }}>
                      {tool.title}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--color-text-3)", lineHeight: 1.5 }}>
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why SwiftConvert ──────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "var(--color-bg-2)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff", marginBottom: 12 }}>
              Why SwiftConvert?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {whyItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: "24px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,208,132,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={18} color="var(--color-brand)" />
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--color-text-1)", marginBottom: 8 }}>{title}</p>
                <p style={{ fontSize: 13, color: "var(--color-text-3)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff", marginBottom: 12 }}>
              How it works
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {[
              { num: "01", title: "Choose a tool", desc: "Pick the conversion you need from our tool list." },
              { num: "02", title: "Upload your files", desc: "Drag & drop or click to select up to 20 files at once." },
              { num: "03", title: "Download results", desc: "Files convert in seconds. Download individually or as ZIP." },
            ].map(({ num, title, desc }) => (
              <div key={num} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 800, letterSpacing: "-2px", color: "rgba(0,208,132,0.2)", marginBottom: 8 }}>{num}</p>
                <p style={{ fontWeight: 700, fontSize: 16, color: "var(--color-text-1)", marginBottom: 8 }}>{title}</p>
                <p style={{ fontSize: 13, color: "var(--color-text-3)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: "80px 24px", borderTop: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff", marginBottom: 12 }}>
              Frequently asked questions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map(({ q, a }) => (
              <div key={q} className="card" style={{ padding: "20px 24px" }}>
                <p style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text-1)", marginBottom: 8 }}>{q}</p>
                <p style={{ fontSize: 14, color: "var(--color-text-3)", lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
