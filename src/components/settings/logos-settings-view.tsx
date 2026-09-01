"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logosService, type LogosApiResponse } from "@/services/logos.service";

type LogoType = "logo" | "dark_logo" | "favicon";

interface LogoState {
  originalUrl: string | null;
  dataUrl: string | null;
  file: File | null;
  preview: string | null;
}

const logoConfig: Record<
  LogoType,
  { label: string; description: string; maxSize: number }
> = {
  logo: {
    label: "Logo",
    description: "Main logo for light backgrounds",
    maxSize: 5,
  },
  dark_logo: {
    label: "Dark Logo",
    description: "Logo for dark backgrounds",
    maxSize: 5,
  },
  favicon: {
    label: "Favicon",
    description: "Browser tab icon (16x16 or 32x32 px recommended)",
    maxSize: 2,
  },
};

// Removed fetchImageAsDataUrl - use <img> tags directly instead of CORS-blocked blob fetching

export function LogosSettingsView() {
  const router = useRouter();
  const [logoState, setLogoState] = useState<Record<LogoType, LogoState>>({
    logo: { originalUrl: null, dataUrl: null, file: null, preview: null },
    dark_logo: { originalUrl: null, dataUrl: null, file: null, preview: null },
    favicon: { originalUrl: null, dataUrl: null, file: null, preview: null },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRefs = useRef<Record<LogoType, HTMLInputElement | null>>({
    logo: null,
    dark_logo: null,
    favicon: null,
  });

  useEffect(() => {
    const loadLogos = async () => {
      try {
        const data = await logosService.getLogos();
        console.log("Loaded logos data:", data);

        setLogoState((prev) => {
          const newState = {
            logo: {
              ...prev.logo,
              originalUrl: data.logo?.value ?? null,
              dataUrl: data.logo?.value ?? null,
              preview: data.logo?.value ?? null,
            },
            dark_logo: {
              ...prev.dark_logo,
              originalUrl: data.dark_logo?.value ?? null,
              dataUrl: data.dark_logo?.value ?? null,
              preview: data.dark_logo?.value ?? null,
            },
            favicon: {
              ...prev.favicon,
              originalUrl: data.favicon?.value ?? null,
              dataUrl: data.favicon?.value ?? null,
              preview: data.favicon?.value ?? null,
            },
          };
          console.log("New logo state:", newState);
          console.log("Logo URL:", newState.logo.originalUrl);
          console.log("Dark Logo URL:", newState.dark_logo.originalUrl);
          console.log("Favicon URL:", newState.favicon.originalUrl);
          return newState;
        });
      } catch (error) {
        console.error("Error loading logos:", error);
        toast.error("Failed to load logos.");
      } finally {
        setLoading(false);
      }
    };

    void loadLogos();
  }, []);

  function handleFileChange(type: LogoType, file: File | null) {
    if (!file) return;

    const config = logoConfig[type];
    if (file.size > config.maxSize * 1024 * 1024) {
      toast.error(`${config.label} must be less than ${config.maxSize}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setLogoState((prev) => ({
        ...prev,
        [type]: { ...prev[type], file, preview },
      }));
    };
    reader.readAsDataURL(file);
  }

  function handleRemove(type: LogoType) {
    setLogoState((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        file: null,
        preview: prev[type].dataUrl || prev[type].originalUrl,
      },
    }));
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]!.value = "";
    }
  }

  function hasChanges(): boolean {
    return (
      logoState.logo.file !== null ||
      logoState.dark_logo.file !== null ||
      logoState.favicon.file !== null
    );
  }

  async function handleSubmit() {
    if (!hasChanges()) {
      toast.info("No logos changed.");
      return;
    }

    const formData = new FormData();
    if (logoState.logo.file) {
      formData.append("logo", logoState.logo.file);
    }
    if (logoState.dark_logo.file) {
      formData.append("dark_logo", logoState.dark_logo.file);
    }
    if (logoState.favicon.file) {
      formData.append("favicon", logoState.favicon.file);
    }

    try {
      setSaving(true);
      await logosService.updateLogos(formData);
      toast.success("Logos updated successfully.");
      // Reset to new uploaded values (using preview which is now the data URL from FileReader)
      setLogoState((prev) => ({
        logo: { 
          ...prev.logo, 
          file: null, 
          originalUrl: prev.logo.preview,
          dataUrl: prev.logo.preview,
        },
        dark_logo: {
          ...prev.dark_logo,
          file: null,
          originalUrl: prev.dark_logo.preview,
          dataUrl: prev.dark_logo.preview,
        },
        favicon: { 
          ...prev.favicon, 
          file: null, 
          originalUrl: prev.favicon.preview,
          dataUrl: prev.favicon.preview,
        },
      }));
    } catch (error) {
      toast.error("Failed to update logos.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center gap-3 text-[#6b7280]">
        <Loader2 className="size-5 animate-spin text-[#2563eb]" />
        <span>Loading logos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/settings")}
          aria-label="Back to settings"
          className="flex size-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#374151] transition hover:bg-[#f9fafb]"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Logo & Favicon Settings
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {(Object.keys(logoConfig) as LogoType[]).map((type) => {
          const config = logoConfig[type];
          const state = logoState[type];
          const isChanged = state.file !== null;

          return (
            <div
              key={type}
              className="rounded-2xl border border-[#e8ecf2] bg-white p-6"
            >
              <div className="mb-4">
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  {config.label}
                </h3>
                <p className="mt-1 text-[14px] text-[#6b7280]">
                  {config.description}
                </p>
              </div>

              {/* Current Logo - Clickable to Update */}
              {state.originalUrl || state.preview ? (
                <div>
                  <p className="mb-3 text-[14px] font-medium text-[#374151]">
                    {isChanged ? "New Logo" : "Current Logo"}
                  </p>
                  <div
                    onClick={() => fileInputRefs.current[type]?.click()}
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#e5e7eb] bg-gradient-to-br from-[#2563eb] to-[#1e40af] p-3 transition hover:from-[#1e40af] hover:to-[#1e3a8a]"
                    style={{
                      width: "100%",
                      height: "90px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ position: "relative", height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={(isChanged ? state.preview : state.originalUrl) || ""}
                        alt={`${config.label}`}
                        style={{
                          maxHeight: "80px",
                          maxWidth: "100%",
                          height: "auto",
                          width: "auto",
                          objectFit: "contain",
                        }}
                        onLoad={(e) => {
                          console.log(`✅ ${type} image loaded and displayed`);
                          (e.target as HTMLImageElement).style.visibility = "visible";
                        }}
                        onError={(e) => {
                          console.error(`❌ Failed to load ${type} image:`, (e.target as HTMLImageElement).src);
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-0 transition group-hover:bg-opacity-20 pointer-events-none">
                      <div className="opacity-0 transition group-hover:opacity-100">
                        <Upload className="size-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-[12px] text-[#9ca3af]">Click to update</p>

                  {/* Fallback display - show image below */}
                  <div className="mt-4 p-3 border border-[#e5e7eb] rounded-xl bg-[#fafbfc]">
                    <p className="text-[12px] text-[#6b7280] mb-2">Image Preview:</p>
                    <img
                      src={(isChanged ? state.preview : state.originalUrl) || ""}
                      alt={`${config.label} fallback`}
                      style={{
                        maxHeight: "200px",
                        maxWidth: "100%",
                        height: "auto",
                        width: "auto",
                        objectFit: "contain",
                        display: "block",
                      }}
                      onLoad={() => {
                        console.log(`✅ Fallback display: ${type} image loaded`);
                      }}
                      onError={() => {
                        console.error(`❌ Fallback display: ${type} image failed`);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-[14px] font-medium text-[#374151]">
                    Upload {config.label}
                  </p>
                  <div
                    onClick={() => fileInputRefs.current[type]?.click()}
                    className="flex h-[90px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#dbeafe] bg-gradient-to-br from-[#eff6ff] to-[#f0f9ff] transition hover:border-[#93c5fd] hover:from-[#e0f2fe] hover:to-[#e0f9ff]"
                  >
                    <Upload className="size-5 text-[#2563eb]" />
                    <div className="text-center">
                      <p className="text-[12px] font-medium text-[#2563eb]">
                        Click to upload
                      </p>
                      <p className="text-[11px] text-[#6b7280]">
                        Max {config.maxSize}MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={(el) => {
                  fileInputRefs.current[type] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(type, e.target.files?.[0] ?? null)
                }
              />

              {isChanged && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemove(type)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#fee2e2] bg-[#fef2f2] px-3 py-2 text-[14px] font-medium text-[#ef4444] transition hover:bg-[#fee2e2]"
                  >
                    <Trash2 className="size-4" />
                    Remove Change
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={saving || !hasChanges()}
        onClick={handleSubmit}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
}
