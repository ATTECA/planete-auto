"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

export default function FloatingQuoteCta() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <Link className="floating-quote-cta" href="/devis">
      <FileText size={19} aria-hidden="true" />
      <span className="floating-quote-label">
        <span>Demander</span>
        <span>un devis</span>
      </span>
    </Link>
  );
}
