import type { Metadata } from "next";

// page.tsx is a Client Component and can't export metadata, so it lives here
export const metadata: Metadata = { title: "Submit a Quote" };

export default function SubmitQuoteLayout({ children }: LayoutProps<"/submit-quote">) {
  return children;
}
