import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/next";
import { FilesProvider } from "@/lib/files-context";
import { FileItem, PdfManifest } from "@/lib/cache";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "爱泼斯坦文件浏览器",
  description: "浏览和查看已发布的爱泼斯坦文件",
};

const WORKER_URL = "https://ep.feng.love";

interface AllFilesResponse {
  files: FileItem[];
  totalReturned: number;
}

async function fetchAllFiles(): Promise<FileItem[]> {
  const response = await fetch(`${WORKER_URL}/api/all-files`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }

  const data: AllFilesResponse = await response.json();
  return data.files;
}

async function fetchPdfManifest(): Promise<PdfManifest> {
  try {
    const response = await fetch(`${WORKER_URL}/api/pdf-manifest`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.warn("PDF manifest not available, falling back to PDF rendering");
      return {};
    }

    return await response.json();
  } catch {
    console.warn("Failed to fetch PDF manifest, falling back to PDF rendering");
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [files, pdfManifest] = await Promise.all([
    fetchAllFiles(),
    fetchPdfManifest(),
  ]);

  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FilesProvider files={files} pdfManifest={pdfManifest}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </FilesProvider>
        <Analytics />
      </body>
    </html>
  );
}
