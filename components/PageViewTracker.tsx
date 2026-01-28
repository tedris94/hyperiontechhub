"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  const key = "hyperion_visitor_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(key, generated);
  return generated;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const visitorId = getVisitorId();
    const referrer = typeof document !== "undefined" ? document.referrer : "";
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const search = searchParams?.toString();
    const path = `${pathname}${search ? `?${search}` : ""}`;

    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer,
        userAgent,
        visitorId,
      }),
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}
