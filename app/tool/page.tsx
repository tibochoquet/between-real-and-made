import type { Metadata } from "next";
import { ToolPage } from "./ToolPage";

export const metadata: Metadata = {
  title: "AI & Muziek — Discussietool",
  description: "Vier vragen over AI in muziek. Ontdek jouw profiel.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ToolPage />;
}
