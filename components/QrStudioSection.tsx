"use client";

import React, { useState, useEffect, useRef } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { QRCodeCanvas } from "qrcode.react";
import {
  listRestaurantTables,
  type RestaurantTable,
} from "@/lib/services/table-service";
import {
  QrCode,
  Copy,
  ExternalLink,
  Download,
  UtensilsCrossed,
  Store,
  Layers,
  Sparkles,
} from "lucide-react";

interface QrStudioSectionProps {
  supabase: SupabaseClient<Database>;
  restaurantId: string;
  storeName: string;
  logoUrl?: string | null;
  baseMenuUrl: string;
  getImageUrl: (url: string) => string;
}

export const QrStudioSection: React.FC<QrStudioSectionProps> = ({
  supabase,
  restaurantId,
  storeName,
  logoUrl,
  baseMenuUrl,
  getImageUrl,
}) => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"store" | "table">("store");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const qrRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function loadTables() {
      if (!restaurantId) return;
      try {
        setLoadingTables(true);
        const data = await listRestaurantTables(supabase, restaurantId, {
          requireActiveOnly: true,
        });
        setTables(data);
        if (data.length > 0 && !selectedTableId) {
          setSelectedTableId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load tables for QR Studio:", err);
      } finally {
        setLoadingTables(false);
      }
    }
    loadTables();
  }, [restaurantId]);

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0] || null;

  // Compute Active URL based on mode
  let activeUrl = baseMenuUrl;
  let activeLabel = storeName;
  let activeSubLabel = "Scan to open digital menu";

  if (selectedMode === "table" && selectedTable) {
    const tableParam = selectedTable.qr_token || selectedTable.table_number;
    const separator = baseMenuUrl.includes("?") ? "&" : "?";
    activeUrl = `${baseMenuUrl}${separator}table=${encodeURIComponent(tableParam)}`;
    activeLabel = `${storeName} - Table ${selectedTable.table_number}`;
    activeSubLabel = selectedTable.label
      ? `${selectedTable.label} • Scan to view menu`
      : "Scan to view menu & call service";
  }

  const handleCopyUrl = async () => {
    if (!activeUrl) return;
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDownloadQr = () => {
    const qrCanvas = qrRef.current;
    if (!qrCanvas) return;

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
      frameBorder * 2 + innerPadding * 2 + headerHeight + qrDrawSize + captionHeight + footerAreaHeight;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    // 1. Draw outer rounded rectangle filled with Brand Blue (#1E45FB)
    context.fillStyle = "#1E45FB";
    context.beginPath();
    context.roundRect(0, 0, exportWidth, exportHeight, outerRadius);
    context.fill();

    // 2. Draw inner white card area
    const innerX = frameBorder;
    const innerY = frameBorder;
    const innerWidth = exportWidth - frameBorder * 2;
    const innerHeight = exportHeight - frameBorder * 2;

    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.roundRect(innerX, innerY, innerWidth, innerHeight, innerRadius);
    context.fill();

    // 3. Render Header
    const centerX = exportWidth / 2;
    const headerY = frameBorder + innerPadding + 45;

    context.textAlign = "center";
    context.fillStyle = "#111111";
    context.font = "600 42px system-ui, -apple-system, sans-serif";
    context.fillText(activeLabel, centerX, headerY);

    // 4. Draw QR Code
    const qrX = (exportWidth - qrDrawSize) / 2;
    const qrY = frameBorder + innerPadding + headerHeight;

    const srcCtx = qrCanvas.getContext("2d");
    let moduleCount = 29;
    let quietZoneModules = 4;

    if (srcCtx) {
      const srcWidth = qrCanvas.width;
      const imgData = srcCtx.getImageData(0, 0, srcWidth, srcWidth);
      const data = imgData.data;

      let marginPixels = 0;
      for (let i = 0; i < srcWidth; i++) {
        const idx = (i * srcWidth + i) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 100 && g < 100 && b < 100) {
          marginPixels = i;
          break;
        }
      }

      let eyePixels = 0;
      for (let i = marginPixels; i < srcWidth; i++) {
        const idx = (marginPixels * srcWidth + i) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 100 && g < 100 && b < 100) {
          eyePixels++;
        } else {
          break;
        }
      }

      if (eyePixels > 0) {
        const modPx = eyePixels / 7;
        quietZoneModules = Math.round(marginPixels / modPx);
        moduleCount = Math.round(srcWidth / modPx);
      }
    }

    const totalModules = moduleCount;
    const moduleDrawSize = qrDrawSize / totalModules;
    const marginDrawOffset = quietZoneModules * moduleDrawSize;
    const eyeDrawSize = 7 * moduleDrawSize;
    const eyeRadius = eyeDrawSize * 0.22;

    context.drawImage(qrCanvas, qrX, qrY, qrDrawSize, qrDrawSize);

    const eyePositions = [
      { x: qrX + marginDrawOffset, y: qrY + marginDrawOffset },
      { x: qrX + qrDrawSize - marginDrawOffset - eyeDrawSize, y: qrY + marginDrawOffset },
      { x: qrX + marginDrawOffset, y: qrY + qrDrawSize - marginDrawOffset - eyeDrawSize },
    ];

    eyePositions.forEach(({ x, y }) => {
      context.fillStyle = "#FFFFFF";
      context.fillRect(x - 0.5, y - 0.5, eyeDrawSize + 1, eyeDrawSize + 1);

      context.fillStyle = "#111111";
      context.beginPath();
      context.roundRect(x, y, eyeDrawSize, eyeDrawSize, eyeRadius);
      context.fill();

      const ringThickness = moduleDrawSize;
      const innerEyeX = x + ringThickness;
      const innerEyeY = y + ringThickness;
      const innerEyeSize = eyeDrawSize - ringThickness * 2;
      const innerEyeRadius = innerEyeSize * 0.20;

      context.fillStyle = "#FFFFFF";
      context.beginPath();
      context.roundRect(innerEyeX, innerEyeY, innerEyeSize, innerEyeSize, innerEyeRadius);
      context.fill();

      const pupilX = x + moduleDrawSize * 2;
      const pupilY = y + moduleDrawSize * 2;
      const pupilSize = moduleDrawSize * 3;
      const pupilRadius = pupilSize * 0.25;

      context.fillStyle = "#111111";
      context.beginPath();
      context.roundRect(pupilX, pupilY, pupilSize, pupilSize, pupilRadius);
      context.fill();
    });

    function finishExport() {
      const captionY = qrY + qrDrawSize + 48;
      context.textAlign = "center";
      context.fillStyle = "#555555";
      context.font = "500 28px system-ui, -apple-system, sans-serif";
      context.fillText(
        selectedMode === "table" && selectedTable
          ? `Scan for Table ${selectedTable.table_number}`
          : "Scan for menu",
        centerX,
        captionY,
      );

      const footerY = captionY + 58;
      context.fillStyle = "#1E45FB";
      context.font = "900 24px system-ui, -apple-system, sans-serif";
      context.letterSpacing = "2px";
      context.fillText("POWERED BY MOSS QR", centerX, footerY);

      const url = exportCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      const filenameSuffix =
        selectedMode === "table" && selectedTable
          ? `-table-${selectedTable.table_number}`
          : "";
      link.download = `${storeName.replace(/\s+/g, "-").toLowerCase()}${filenameSuffix}-qr-code.png`;
      link.href = url;
      link.click();
    }

    if (logoUrl) {
      const logo = new Image();
      logo.onload = () => {
        const logoSize = 160;
        const logoX = (exportWidth - logoSize) / 2;
        const logoY = qrY + (qrDrawSize - logoSize) / 2;

        context.fillStyle = "#FFFFFF";
        context.beginPath();
        context.roundRect(logoX - 14, logoY - 14, logoSize + 28, logoSize + 28, 26);
        context.fill();

        context.strokeStyle = "#1E45FB";
        context.lineWidth = 5;
        context.beginPath();
        context.roundRect(logoX - 10, logoY - 10, logoSize + 20, logoSize + 20, 22);
        context.stroke();

        context.save();
        context.beginPath();
        context.roundRect(logoX, logoY, logoSize, logoSize, 18);
        context.clip();
        context.drawImage(logo, logoX, logoY, logoSize, logoSize);
        context.restore();

        finishExport();
      };
      logo.onerror = () => {
        finishExport();
      };
      logo.crossOrigin = "anonymous";
      logo.src = getImageUrl(logoUrl);
    } else {
      finishExport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#1e2417]/10 p-6 rounded-3xl shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#f6f2e8] text-[#1b2414]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e2417] tracking-tight">QR Code Studio</h2>
              <p className="text-xs text-[#57604f]">
                Generate high-resolution printable QR codes for entire restaurants or individual tables.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-[#f6f2e8] p-1 rounded-2xl border border-[#1e2417]/10 self-start sm:self-auto">
            <button
              onClick={() => setSelectedMode("store")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMode === "store"
                  ? "bg-[#1b2414] text-[#c8f04a] shadow-xs"
                  : "text-[#57604f] hover:text-[#1e2417]"
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Restaurant QR
            </button>
            <button
              onClick={() => setSelectedMode("table")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMode === "table"
                  ? "bg-[#1b2414] text-[#c8f04a] shadow-xs"
                  : "text-[#57604f] hover:text-[#1e2417]"
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" /> Table-Specific QR
            </button>
          </div>
        </div>
      </div>

      {/* Table Selector bar when Table mode is active */}
      {selectedMode === "table" && (
        <div className="bg-white border border-[#1e2417]/10 p-4 rounded-3xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#57604f]" />
            <span className="text-xs font-bold text-[#1e2417]">Select Table:</span>
          </div>

          {tables.length === 0 ? (
            <p className="text-xs text-[#57604f]">
              No active tables found. Please add tables in the "Tables" tab first.
            </p>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="w-full sm:w-64 bg-[#f6f2e8]/50 border border-[#1e2417]/15 rounded-xl px-3.5 py-2 text-xs font-bold text-[#1e2417] focus:outline-none focus:border-[#1b2414]"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.table_number} {t.label ? `(${t.label})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Preview Card */}
        <div className="bg-white border border-[#1e2417]/10 rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-2xs">
          <div className="relative bg-white p-5 rounded-3xl border border-[#1e2417]/10 shadow-sm">
            {activeUrl && (
              <QRCodeCanvas
                ref={qrRef}
                value={activeUrl}
                size={220}
                level="H"
                includeMargin
                bgColor="#FFFFFF"
                fgColor="#1b2414"
              />
            )}
            {logoUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md border border-[#1e2417]/10">
                  <img
                    src={getImageUrl(logoUrl)}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-5">
            {logoUrl && (
              <img
                src={getImageUrl(logoUrl)}
                alt=""
                className="w-10 h-10 rounded-xl object-cover mx-auto mb-2 border border-[#1e2417]/10"
              />
            )}
            <p className="text-sm font-bold text-[#1e2417]">{activeLabel}</p>
            <p className="text-xs text-[#57604f] mt-0.5 font-medium">{activeSubLabel}</p>

            {selectedMode === "table" && selectedTable && (
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c8f04a]/50 text-[#1b2414] border border-[#1b2414]/10">
                <Sparkles className="w-3 h-3" /> NFC Ready URL Encoded
              </div>
            )}
          </div>
        </div>

        {/* Action / Details Card */}
        <div className="bg-white border border-[#1e2417]/10 rounded-3xl p-6 space-y-5 shadow-2xs flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-[#1e2417] mb-2">
              {selectedMode === "table" ? "Table-Specific QR URL" : "Live Menu URL"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={activeUrl}
                className="flex-1 bg-[#f6f2e8]/40 border border-[#1e2417]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1e2417] font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="shrink-0 bg-white border border-[#1e2417]/15 text-[#1e2417] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#f6f2e8] active:scale-95 transition-all min-h-[42px] shadow-2xs"
              >
                <Copy className="w-4 h-4 text-[#57604f]" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] text-[#57604f] mt-1.5">
              {selectedMode === "table"
                ? "This QR directs customers straight to this table's menu with ordering and service context."
                : "General QR code for walk-ins, social media, storefront banners, or general flyers."}
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={activeUrl || "/menu"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1b2414] text-[#c8f04a] font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-black active:scale-[0.99] transition-all shadow-sm min-h-[46px]"
            >
              <ExternalLink className="w-4 h-4" /> Preview Diner Experience
            </a>
            <button
              onClick={handleDownloadQr}
              className="w-full bg-white border border-[#1e2417]/15 text-[#1e2417] font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-[#f6f2e8] hover:text-[#1b2414] active:scale-[0.99] transition-all min-h-[46px] shadow-2xs"
            >
              <Download className="w-4 h-4" /> Download Printable QR
            </button>
          </div>

          <div className="bg-[#f6f2e8]/40 border border-[#1e2417]/10 rounded-2xl p-4">
            <p className="text-xs font-bold text-[#1e2417] mb-1.5">Deployment advice:</p>
            <ol className="text-xs text-[#57604f] space-y-1 list-decimal list-inside font-medium leading-relaxed">
              <li>Print individual table QR codes for acrylic table cards or sticker tags.</li>
              <li>Future NFC tags can also be written using this exact same target URL.</li>
              <li>When diners scan, their session is automatically tied to Table {selectedTable?.table_number || "X"}.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
