"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  QrCode,
  Download,
  Printer,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
  UtensilsCrossed,
  Check,
} from "lucide-react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { getPublicMenuUrl } from "@/lib/store";
import { sanitizeFilename } from "@/lib/utils";
import { getImageUrl } from "@/lib/image-url";

const QR_SIZE = 280;
const QR_DOWNLOAD_SIZE = 1024;
const QR_LEVEL = "H" as const;

interface QrCodeGeneratorProps {
  storeName: string;
  storeProfileId: string | null;
  logoUrl?: string | null;
  loading: boolean;
  profileError?: boolean;
  availableItemCount: number;
  onManageMenu: () => void;
}

export function QrCodeGenerator({
  storeName,
  storeProfileId,
  logoUrl,
  loading,
  profileError = false,
  availableItemCount,
  onManageMenu,
}: QrCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [menuUrl, setMenuUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"png" | "svg" | null>(null);

  useEffect(() => {
    setMenuUrl(getPublicMenuUrl());
  }, []);

  const isMenuReady =
    !loading && !profileError && !!storeProfileId && availableItemCount > 0;

  const fileBase = `${sanitizeFilename(storeName)}-menu-qr`;

  const handleCopyLink = useCallback(async () => {
    if (!menuUrl) return;
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError("Could not copy the link. Please copy it manually.");
    }
  }, [menuUrl]);

  const handleDownloadPng = useCallback(() => {
    if (!menuUrl) return;
    setActionError(null);
    setDownloading("png");
    try {
      const source = canvasRef.current;
      if (!source) throw new Error("QR preview not ready");

      const canvas = document.createElement("canvas");
      canvas.width = QR_DOWNLOAD_SIZE;
      canvas.height = QR_DOWNLOAD_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, QR_DOWNLOAD_SIZE, QR_DOWNLOAD_SIZE);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(source, 0, 0, QR_DOWNLOAD_SIZE, QR_DOWNLOAD_SIZE);

      const link = document.createElement("a");
      link.download = `${fileBase}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      setActionError("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  }, [menuUrl, fileBase]);

  const handleDownloadSvg = useCallback(() => {
    if (!menuUrl) return;
    setActionError(null);
    setDownloading("svg");
    try {
      const svg = svgContainerRef.current?.querySelector("svg");
      if (!svg) throw new Error("SVG not ready");
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${fileBase}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setActionError("SVG download failed. Try downloading PNG instead.");
    } finally {
      setDownloading(null);
    }
  }, [menuUrl, fileBase]);

  const handlePrint = useCallback(() => {
    if (!menuUrl) return;
    setActionError(null);
    try {
      const printWindow = window.open("", "_blank", "noopener,noreferrer");
      if (!printWindow) {
        setActionError("Pop-up blocked. Allow pop-ups to print your QR code.");
        return;
      }

      const qrDataUrl = canvasRef.current?.toDataURL("image/png") ?? "";

      printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${storeName} — Menu QR</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 48px 24px;
      color: #1C1917;
    }
    .sheet {
      text-align: center;
      max-width: 400px;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    .instruction {
      font-size: 0.875rem;
      color: #78716C;
      margin-bottom: 32px;
    }
    .qr-wrap {
      display: inline-block;
      padding: 16px;
      border: 2px solid #E7E5E4;
      border-radius: 16px;
      background: #fff;
      margin-bottom: 24px;
    }
    .qr-wrap img {
      display: block;
      width: 240px;
      height: 240px;
    }
    .url {
      font-size: 0.75rem;
      color: #A8A29E;
      word-break: break-all;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <h1>${storeName.replace(/</g, "&lt;")}</h1>
    <p class="instruction">Scan to view our menu</p>
    <div class="qr-wrap">
      <img src="${qrDataUrl}" alt="Menu QR code for ${storeName.replace(/"/g, "&quot;")}" width="240" height="240" />
    </div>
    <p class="url">${menuUrl.replace(/</g, "&lt;")}</p>
  </div>
  <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };</script>
</body>
</html>`);
      printWindow.document.close();
    } catch {
      setActionError("Print failed. Please try again.");
    }
  }, [menuUrl, storeName]);

  if (loading) {
    return (
      <div className="space-y-6">
        <QrHeader storeName={storeName} />
        <div className="bg-[#FDFBF7] border border-[#E7E5E4] rounded-3xl py-20 flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-[#0B7A5F]" aria-hidden="true" />
          <p className="text-sm text-[#78716C]">Loading your menu QR code...</p>
        </div>
      </div>
    );
  }

  if (profileError || !storeProfileId) {
    return (
      <div className="space-y-6">
        <QrHeader storeName={storeName} />
        <div className="bg-[#FDFBF7] border border-[#E7E5E4] rounded-3xl p-8 text-center space-y-4 shadow-xs">
          <AlertCircle className="w-10 h-10 mx-auto text-rose-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[#1C1917]">Restaurant not found</p>
            <p className="text-xs text-[#78716C] mt-1">
              We couldn&apos;t load your restaurant profile. Please refresh the page or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isMenuReady) {
    return (
      <div className="space-y-6">
        <QrHeader storeName={storeName} />
        <div className="bg-[#FDFBF7] border border-[#E7E5E4] rounded-3xl p-8 text-center space-y-4 shadow-xs">
          <UtensilsCrossed className="w-10 h-10 mx-auto text-[#A8A29E]" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[#1C1917]">Your menu isn&apos;t ready yet</p>
            <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
              Add at least one visible menu item before generating a QR code for your customers.
            </p>
          </div>
          <button
            type="button"
            onClick={onManageMenu}
            className="inline-flex items-center gap-2 bg-[#0B7A5F] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#09634d] transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F] focus-visible:ring-offset-2"
          >
            <UtensilsCrossed className="w-4 h-4" aria-hidden="true" />
            Go to Menu Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QrHeader storeName={storeName} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR preview */}
        <div className="bg-[#FDFBF7] border border-[#E7E5E4] rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-xs">
          {logoUrl && (
            <img
              src={getImageUrl(logoUrl)}
              alt=""
              className="w-12 h-12 rounded-xl object-cover border border-[#E7E5E4] mb-4"
            />
          )}
          <h3 className="text-base font-bold text-[#1C1917] text-center mb-6">{storeName}</h3>

          <div className="bg-white p-4 rounded-2xl border-2 border-[#E7E5E4] shadow-sm">
            <QRCodeCanvas
              ref={canvasRef}
              value={menuUrl}
              size={QR_SIZE}
              level={QR_LEVEL}
              includeMargin
              bgColor="#FFFFFF"
              fgColor="#000000"
              role="img"
              aria-label={`QR code linking to ${storeName} digital menu`}
            />
          </div>

          {/* Hidden SVG for download */}
          <div ref={svgContainerRef} className="sr-only" aria-hidden="true">
            <QRCodeSVG
              value={menuUrl}
              size={QR_SIZE}
              level={QR_LEVEL}
              includeMargin
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>

          <p className="text-sm text-[#78716C] mt-6 font-medium">Scan to view our menu</p>
          <p className="text-[10px] text-[#A8A29E] mt-1 font-mono break-all text-center px-4">
            {menuUrl}
          </p>
        </div>

        {/* Actions */}
        <div className="bg-[#FDFBF7] border border-[#E7E5E4] rounded-3xl p-6 space-y-5 shadow-xs">
          <div>
            <p className="text-xs font-bold text-[#1C1917] mb-1">Restaurant Menu QR Code</p>
            <p className="text-[11px] text-[#78716C]">
              Customers can scan this QR code to open your digital menu.
            </p>
          </div>

          <div>
            <label htmlFor="qr-menu-url" className="block text-xs font-bold text-[#1C1917] mb-2">
              Public menu link
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="qr-menu-url"
                type="text"
                readOnly
                value={menuUrl}
                className="flex-1 bg-white border border-[#E7E5E4] rounded-xl px-3.5 py-2.5 text-xs text-[#78716C] focus:outline-none min-h-[44px]"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 bg-white border border-[#E7E5E4] text-[#1C1917] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F5F5F4] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F]"
                aria-label="Copy menu link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#0B7A5F]" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    Copy link
                  </>
                )}
              </button>
            </div>
            {copyError && (
              <p className="text-xs text-rose-600 mt-2" role="alert">
                {copyError}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={downloading !== null}
              className="w-full bg-[#0B7A5F] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#09634d] transition-all shadow-sm min-h-[44px] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F] focus-visible:ring-offset-2"
            >
              {downloading === "png" ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="w-4 h-4" aria-hidden="true" />
              )}
              Download QR (PNG)
            </button>

            <button
              type="button"
              onClick={handleDownloadSvg}
              disabled={downloading !== null}
              className="w-full bg-white border border-[#E7E5E4] text-[#1C1917] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#F5F5F4] transition-all min-h-[44px] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F]"
            >
              {downloading === "svg" ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="w-4 h-4" aria-hidden="true" />
              )}
              Download QR (SVG)
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full bg-white border border-[#E7E5E4] text-[#1C1917] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#F5F5F4] transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F]"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              Print QR Code
            </button>

            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-[#E7E5E4] text-[#1C1917] font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#F5F5F4] transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F]"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Preview live menu
            </a>
          </div>

          {actionError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2" role="alert">
              {actionError}
            </p>
          )}

          <div className="bg-[#F4F1EA]/60 border border-[#E7E5E4] rounded-xl p-4">
            <p className="text-[11px] font-bold text-[#1C1917] mb-1">Tips</p>
            <ul className="text-[11px] text-[#78716C] space-y-1 list-disc list-inside">
              <li>Print and place on tables, counters, or entrances</li>
              <li>Use PNG for quick sharing; SVG for professional printing</li>
              <li>Test by scanning with your phone camera</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function QrHeader({ storeName }: { storeName: string }) {
  return (
    <div className="bg-[#FDFBF7] border border-[#E7E5E4] p-6 rounded-3xl shadow-xs">
      <div className="flex items-center gap-2 mb-1">
        <QrCode className="w-5 h-5 text-[#0B7A5F]" aria-hidden="true" />
        <h2 className="text-xl md:text-2xl font-bold text-[#1C1917] tracking-tight">
          QR Code
        </h2>
      </div>
      <p className="text-xs text-[#78716C] mt-0.5">
        Generate a scannable QR code for{" "}
        <span className="font-semibold text-[#1C1917]">{storeName}</span>
      </p>
    </div>
  );
}
