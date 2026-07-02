import type { Metadata } from "next";
import "../medflow.css";
import { Shell } from "@/components/medflow/shell";

export const metadata: Metadata = {
  title: "MedFlow AI — Premium Clinic OS",
  description: "A world-class, enterprise-grade clinic management platform.",
};

export default function MedFlowLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
