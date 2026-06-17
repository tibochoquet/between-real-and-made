import type { Metadata } from "next";
import { AudioLandingPage } from "./AudioLandingPage";

export const metadata: Metadata = {
  title: "Luistertest — Between Real and Made",
  description: "Kun jij horen of dit door een mens of AI is gemaakt?",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ListenPage() {
  return <AudioLandingPage />;
}
