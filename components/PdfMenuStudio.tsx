"use client";

import React, { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import {
  FileText,
  Upload,
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Trash2,
  AlertCircle,
  RefreshCcw,
  Eye,
  QrCode,
  Store,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------
   TYPES
------------------------------------------------------------------ */

export interface PdfRestaurant {
  id: string;
  name: string;
  status: "pending" | "active" | "disabled";
  menu_mode?: string | null;
  menu_pdf_path?: string | null;
}

interface PdfMenuStudioProps {
  restaurants: PdfRestaurant[];
  baseUrl: string; // e.g. "https://yourdomain.com"
}

type UploadPhase =
  | "idle"
  | "uploading"
  | "saving"
  | "done"
  | "error"
  | "reverting";

/* ------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------ */

function getPdfPublicUrl(supabase: ReturnType<typeof createClient>, path: string): string {
  const { data } = supabase.storage.from("menu-pdfs").getPublicUrl(path);
  // Route through the proxy so it works under Myanmar ISPs
  const rawUrl = data?.publicUrl ?? "";
  if (rawUrl.includes(".supabase.co/storage/v1/object/public/")) {
    return rawUrl.replace(
      /https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//,
      "/supabase-proxy/storage/v1/object/public/"
    );
  }
  return rawUrl;
}

function fileNameFromPath(path: string): string {
  return path.split("/").pop() ?? path;
}

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------ */

export default function PdfMenuStudio({ restaurants, baseUrl }: PdfMenuStudioProps) {
  const supabase = createClient();

  // Restaurant selection
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedRestaurant = restaurants.find((r) => r.id === selectedId) ?? null;

  // Local mirror of the selected restaurant's PDF state so the UI updates immediately
  const [localMenuMode, setLocalMenuMode] = useState<string | null>(null);
  const [localPdfPath, setLocalPdfPath] = useState<string | null>(null);

  const effectiveMode = localMenuMode ?? selectedRestaurant?.menu_mode ?? "digital";
  const effectivePdfPath = localPdfPath ?? selectedRestaurant?.menu_pdf_path ?? null;

  // Upload state
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // QR / URL copy state
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // PDF preview expansion
  const [showPreview, setShowPreview] = useState(false);

  // Derived values
  const menuUrl = selectedId ? `${baseUrl}/menu?restaurantId=${selectedId}` : "";
  const pdfPublicUrl = effectivePdfPath
    ? getPdfPublicUrl(supabase, effectivePdfPath)
    : null;
  const isInPdfMode = effectiveMode === "pdf" && Boolean(effectivePdfPath);
  const isBusy =
    uploadPhase === "uploading" ||
    uploadPhase === "saving" ||
    uploadPhase === "reverting";

  /* ----------------------------------------------------------------
     Handlers
  ---------------------------------------------------------------- */

  const handleSelectRestaurant = (id: string) => {
    setSelectedId(id);
    setLocalMenuMode(null);
    setLocalPdfPath(null);
    setUploadPhase("idle");
    setUploadError(null);
    setShowPreview(false);
  };

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (!selectedId) return;
      setUploadError(null);

      // Client-side validation
      if (file.type !== "application/pdf") {
        setUploadError("Only PDF files are accepted.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("PDF must be under 5 MB.");
        return;
      }

      try {
        // 1. Upload to storage
        setUploadPhase("uploading");
        setUploadProgress("Uploading PDF to storage…");

        // Delete previous PDF if one exists
        if (effectivePdfPath) {
          await supabase.storage.from("menu-pdfs").remove([effectivePdfPath]);
        }

        const storagePath = `${selectedId}/menu-${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("menu-pdfs")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: "application/pdf",
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // 2. Call RPC to atomically set menu_mode + menu_pdf_path
        setUploadPhase("saving");
        setUploadProgress("Saving PDF menu settings…");

        const { error: rpcError } = await (supabase as any).rpc(
          "set_restaurant_pdf_menu",
          {
            p_restaurant_id: selectedId,
            p_path: storagePath,
          }
        );

        if (rpcError) {
          // If the RPC fails, clean up the uploaded file
          await supabase.storage.from("menu-pdfs").remove([storagePath]);
          throw new Error(rpcError.message);
        }

        // 3. Update local state
        setLocalMenuMode("pdf");
        setLocalPdfPath(storagePath);
        setUploadPhase("done");
        setUploadProgress("");
        setShowPreview(true);
      } catch (err: any) {
        setUploadPhase("error");
        setUploadError(err?.message ?? "Upload failed. Please try again.");
        setUploadProgress("");
      }
    },
    [selectedId, effectivePdfPath, supabase]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelected(file);
    },
    [handleFileSelected]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    // Reset so re-selecting the same file still fires onChange
    e.target.value = "";
  };

  const handleRevertToDigital = async () => {
    if (!selectedId) return;
    try {
      setUploadPhase("reverting");
      setUploadError(null);

      const { error: rpcError } = await (supabase as any).rpc(
        "set_restaurant_pdf_menu",
        {
          p_restaurant_id: selectedId,
          p_path: null,
        }
      );

      if (rpcError) throw new Error(rpcError.message);

      // Optionally remove the stored file
      if (effectivePdfPath) {
        await supabase.storage.from("menu-pdfs").remove([effectivePdfPath]);
      }

      setLocalMenuMode("digital");
      setLocalPdfPath(null);
      setUploadPhase("idle");
      setShowPreview(false);
    } catch (err: any) {
      setUploadPhase("error");
      setUploadError(err?.message ?? "Failed to revert. Please try again.");
    }
  };

  const handleCopyUrl = async () => {
    if (!menuUrl) return;
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const handleDownloadQr = () => {
    const qrCanvas = qrRef.current;
    if (!qrCanvas || !selectedRestaurant) return;

    const exportWidth = 1200;
    const frameBorder = 28;
    const outerRadius = 44;
    const innerRadius = 32;
    const innerPadding = 60;
    const headerHeight = 110;
    const qrDrawSize = 680;
    const captionHeight = 65;
    const footerAreaHeight = 95;
    const exportHeight =
      frameBorder * 2 +
      innerPadding * 2 +
      headerHeight +
      qrDrawSize +
      captionHeight +
      footerAreaHeight;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Outer frame
    ctx.fillStyle = "#1E45FB";
    ctx.beginPath();
    ctx.roundRect(0, 0, exportWidth, exportHeight, outerRadius);
    ctx.fill();

    // Inner white card
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(frameBorder, frameBorder, exportWidth - frameBorder * 2, exportHeight - frameBorder * 2, innerRadius);
    ctx.fill();

    // Header: restaurant name
    const centerX = exportWidth / 2;
    ctx.textAlign = "center";
    ctx.fillStyle = "#111111";
    ctx.font = "600 42px system-ui, -apple-system, sans-serif";
    ctx.fillText(selectedRestaurant.name, centerX, frameBorder + innerPadding + 45);

    // QR code
    const qrX = (exportWidth - qrDrawSize) / 2;
    const qrY = frameBorder + innerPadding + headerHeight;
    ctx.drawImage(qrCanvas, qrX, qrY, qrDrawSize, qrDrawSize);

    // Caption
    const captionY = qrY + qrDrawSize + 48;
    ctx.fillStyle = "#555555";
    ctx.font = "500 28px system-ui, -apple-system, sans-serif";
    ctx.fillText("Scan for menu", centerX, captionY);

    // Footer
    ctx.fillStyle = "#1E45FB";
    ctx.font = "900 24px system-ui, -apple-system, sans-serif";
    ctx.fillText("POWERED BY MOSS QR", centerX, captionY + 58);

    // Trigger download
    const link = document.createElement("a");
    link.download = `${selectedRestaurant.name.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  /* ----------------------------------------------------------------
     RENDER HELPERS
  ---------------------------------------------------------------- */

  const statusBadge = () => {
    if (isInPdfMode) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
          <FileText className="w-3 h-3" />
          PDF Mode Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#c8f04a]/50 text-[#1b2414] border border-[#1b2414]/10">
        <Store className="w-3 h-3" />
        MOSS Theme (Digital)
      </span>
    );
  };

  /* ----------------------------------------------------------------
     RENDER
  ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="bg-white border border-white/10 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-[#CDF22B]/20 text-[#1b2414] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              PDF Menu Studio
            </h2>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Upload a restaurant&apos;s PDF menu. Customers scan the QR code and see the PDF. Switch back to MOSS Theme anytime.
            </p>
          </div>
        </div>
      </div>

      {/* ── Restaurant Selector ───────────────────────────────────── */}
      <div className="bg-[#1A1A1E] border border-white/10 rounded-3xl p-6 space-y-3">
        <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
          Select Restaurant
        </label>
        <select
          value={selectedId}
          onChange={(e) => handleSelectRestaurant(e.target.value)}
          className="w-full bg-[#0F0F11] border border-white/15 rounded-2xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#CDF22B]/60 transition-colors"
          disabled={isBusy}
        >
          <option value="">— choose a restaurant —</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
              {r.menu_mode === "pdf" ? " [PDF Mode]" : ""}
              {r.status !== "active" ? ` (${r.status})` : ""}
            </option>
          ))}
        </select>

        {selectedRestaurant && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {statusBadge()}
            <span className="text-[11px] text-neutral-500 font-mono">
              {selectedRestaurant.id}
            </span>
          </div>
        )}
      </div>

      {/* ── PDF Upload & Status ─────────────────────────────────── */}
      {selectedRestaurant && (
        <>
          <div className="bg-[#1A1A1E] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white">PDF Menu</h3>
              {isInPdfMode && (
                <button
                  type="button"
                  onClick={handleRevertToDigital}
                  disabled={isBusy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-neutral-300 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all disabled:opacity-50"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Revert to MOSS Theme
                </button>
              )}
            </div>

            {/* Current PDF filename */}
            {effectivePdfPath && (
              <div className="flex items-center gap-3 p-3 bg-blue-950/40 border border-blue-500/20 rounded-2xl">
                <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-blue-300 truncate">
                    {fileNameFromPath(effectivePdfPath)}
                  </p>
                  <p className="text-[11px] text-blue-400/70 mt-0.5">
                    Currently assigned PDF
                  </p>
                </div>
                {pdfPublicUrl && (
                  <button
                    type="button"
                    onClick={() => setShowPreview((v) => !v)}
                    className="shrink-0 p-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                    title={showPreview ? "Hide preview" : "Show preview"}
                  >
                    {showPreview ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            )}

            {/* PDF inline preview */}
            {showPreview && pdfPublicUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                <iframe
                  src={pdfPublicUrl}
                  title="PDF Menu Preview"
                  className="w-full h-[60vh] min-h-[400px]"
                  style={{ border: "none" }}
                />
              </div>
            )}

            {/* Drop zone / upload */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload PDF"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !isBusy && fileInputRef.current?.click()}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                !isBusy &&
                fileInputRef.current?.click()
              }
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                isBusy
                  ? "opacity-60 cursor-not-allowed border-white/10"
                  : "border-white/15 hover:border-[#CDF22B]/40 hover:bg-[#CDF22B]/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleInputChange}
                disabled={isBusy}
              />

              {isBusy ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#CDF22B] animate-spin" />
                  <p className="text-sm font-medium text-neutral-400">
                    {uploadProgress}
                  </p>
                </div>
              ) : uploadPhase === "done" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-400">
                      Upload successful!
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Drop or click to replace the PDF
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-300">
                      {isInPdfMode ? "Replace PDF" : "Upload PDF Menu"}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Drag &amp; drop or click — PDF only, max 5 MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error message */}
            {uploadError && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-950/60 border border-rose-500/30 rounded-2xl">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-rose-300">{uploadError}</p>
              </div>
            )}
          </div>

          {/* ── QR Code + URL ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Preview */}
            <div className="bg-[#1A1A1E] border border-white/10 rounded-3xl p-6 flex flex-col items-center space-y-4">
              <div className="flex items-center gap-2 self-start">
                <QrCode className="w-4 h-4 text-[#CDF22B]" />
                <h3 className="text-sm font-bold text-white">QR Code</h3>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-md">
                <QRCodeCanvas
                  ref={qrRef}
                  value={menuUrl}
                  size={180}
                  level="H"
                  includeMargin
                  bgColor="#FFFFFF"
                  fgColor="#111111"
                />
              </div>

              <div className="text-center">
                <p className="text-xs font-bold text-neutral-300">
                  {selectedRestaurant.name}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Scan to open{" "}
                  {isInPdfMode ? "PDF menu" : "digital menu"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadQr}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-all min-h-[40px]"
              >
                <Download className="w-4 h-4" />
                Download High-Res QR
              </button>
            </div>

            {/* URL + actions */}
            <div className="bg-[#1A1A1E] border border-white/10 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Customer Menu URL</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={menuUrl}
                    className="flex-1 min-w-0 bg-[#0F0F11] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-neutral-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-all min-h-[40px]"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  This URL always points to the restaurant&apos;s active menu. It
                  works for both PDF mode and MOSS Theme — no need to reprint QR
                  codes when switching modes.
                </p>
              </div>

              <div className="space-y-2.5">
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#CDF22B] text-[#111111] text-xs font-black hover:bg-[#bce022] active:scale-[0.99] transition-all min-h-[44px] shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Preview Customer Menu
                </a>

                {isInPdfMode && pdfPublicUrl && (
                  <a
                    href={pdfPublicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-all min-h-[44px]"
                  >
                    <FileText className="w-4 h-4" />
                    Open PDF directly
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Empty state when no restaurant is selected ────────────── */}
      {!selectedRestaurant && (
        <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
            <Store className="w-7 h-7 text-neutral-500" />
          </div>
          <p className="text-sm font-bold text-neutral-400">
            Select a restaurant to begin
          </p>
          <p className="text-xs text-neutral-600 max-w-xs mx-auto leading-relaxed">
            Choose a restaurant from the dropdown above to upload its PDF menu
            and generate a QR code.
          </p>
        </div>
      )}
    </div>
  );
}
