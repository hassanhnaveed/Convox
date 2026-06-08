import type { Metadata } from "next";
import { TOOL_CONFIG } from "@/lib/utils";
import { ToolPage } from "@/components/tools/ToolPage";

const config = TOOL_CONFIG["webp-to-png"];

export const metadata: Metadata = {
  title: config.title + " — Free Online Converter",
  description: config.longDesc,
  alternates: { canonical: "/webp-to-png" },
};

export default function Page() {
  return <ToolPage slug="webp-to-png" />;
}
