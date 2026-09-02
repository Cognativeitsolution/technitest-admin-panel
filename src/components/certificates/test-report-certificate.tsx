"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type TestReportCertificateProps = {
  reportNumber: string;
  candidateName: string;
  candidatePhotoUrl?: string | null;
  jobTitle: string;
  testDate: string;
  referenceNo: string;
  remarks: string;
  totalMarks: number | string;
  marksObtained: number | string;
  grade: string;
  pointsConsidered: string;
  heading?: string;
  openingLine?: string;
  statement?: string;
  companyName?: string;
  tagline?: string;
  subtitle?: string;
  logoUrl?: string | null;
  signatureImageUrl?: string | null;
  signatureText?: string;
  sealLabel?: string;
  qrValue?: string;
  qrCodeUrl?: string | null;
  className?: string;
};

const W = 1480;
const H = 860;
const NAVY = "#1B365D";
const GOLD = "#C9A227";
const ORANGE = "#E38A1D";
const BADGE = "#E87A12";
const LABEL_GRAY = "#8A8F98";

const DEFAULT_LOGO = "/certificates/logo.png";
const DEFAULT_SEAL = "/certificates/seal-beginner.png";
const DEFAULT_QR = "/certificates/qr-default.png";
const WATERMARK_BG = "/certificates/watermark-bg.jpg";

function CornerAccents() {
  return (
    <>
      <svg
        className="pointer-events-none absolute top-0 left-0"
        width="210"
        height="118"
        viewBox="0 0 210 118"
        aria-hidden
      >
        <polygon points="0,0 210,0 0,118" fill={NAVY} />
        <polygon points="0,0 158,0 0,88" fill={GOLD} />
        <polygon points="0,0 104,0 0,58" fill={NAVY} />
      </svg>
      <svg
        className="pointer-events-none absolute top-0 right-0"
        width="210"
        height="118"
        viewBox="0 0 210 118"
        aria-hidden
      >
        <polygon points="210,0 0,0 210,118" fill={NAVY} />
        <polygon points="210,0 52,0 210,88" fill={GOLD} />
        <polygon points="210,0 106,0 210,58" fill={NAVY} />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-0 left-0"
        width="170"
        height="92"
        viewBox="0 0 170 92"
        aria-hidden
      >
        <polygon points="0,92 170,92 0,0" fill={NAVY} />
        <polygon points="0,92 118,92 0,28" fill={GOLD} />
      </svg>
      <svg
        className="pointer-events-none absolute right-0 bottom-0"
        width="170"
        height="92"
        viewBox="0 0 170 92"
        aria-hidden
      >
        <polygon points="170,92 0,92 170,0" fill={NAVY} />
        <polygon points="170,92 52,92 170,28" fill={GOLD} />
      </svg>
    </>
  );
}

export function TestReportCertificate({
  reportNumber,
  candidateName,
  candidatePhotoUrl,
  jobTitle,
  testDate,
  referenceNo,
  remarks,
  totalMarks,
  marksObtained,
  grade,
  pointsConsidered,
  heading = "TEST REPORT",
  openingLine = "This is to Certify that",
  statement = "has successfully appeared in the TECH-NI-TEST Trade Test conducted for the post of",
  signatureImageUrl,
  signatureText = "Signature",
  qrValue,
  qrCodeUrl,
  className,
}: TestReportCertificateProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setScale(Math.max(el.clientWidth / W, 0.01));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const qrSrc =
    qrCodeUrl ||
    (qrValue
      ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(qrValue)}`
      : DEFAULT_QR);

  return (
    <div
      ref={frameRef}
      className={cn("relative w-full overflow-hidden", className)}
      data-testid="test-report-certificate"
      style={{ height: H * scale }}
    >
      <article
        className="absolute top-0 left-0 origin-top-left overflow-hidden text-[#111]"
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          boxShadow: "0 18px 40px rgba(16,24,40,0.12)",
          backgroundColor: "#ffffff",
          backgroundImage: `url(${WATERMARK_BG})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
        }}
      >
        <CornerAccents />

        <div
          className="pointer-events-none absolute"
          style={{
            inset: 16,
            border: `1.5px solid ${GOLD}`,
            borderRadius: 2,
          }}
        />

        <div
          className="absolute"
          style={{ top: 44, left: 56, zIndex: 2 }}
        >
          <span
            className="inline-flex items-center rounded-[8px] px-[16px] py-[7px] text-[13px] font-extrabold tracking-[0.14em] text-white uppercase"
            style={{ background: BADGE }}
          >
            {heading}
          </span>
          <p
            className="mt-[16px] text-[11px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: LABEL_GRAY }}
          >
            REPORT NO
          </p>
          <p className="mt-[3px] text-[22px] leading-none font-extrabold">
            {reportNumber}
          </p>
        </div>

        <img
          src={DEFAULT_LOGO}
          alt="TECH-NI-TEST"
          className="absolute object-contain object-center"
          style={{
            top: 32,
            left: "50%",
            width: 460,
            height: 102,
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        />

        <div
          className="absolute overflow-hidden rounded-[8px] bg-white"
          style={{
            top: 36,
            right: 56,
            width: 108,
            height: 136,
            border: `2px solid ${GOLD}`,
            padding: 4,
            zIndex: 2,
          }}
        >
          {candidatePhotoUrl ? (
            <img
              src={candidatePhotoUrl}
              alt={candidateName}
              className="h-full w-full rounded-[4px] object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] font-semibold tracking-[0.16em] text-[#9ca3af] uppercase">
              Photo
            </div>
          )}
        </div>

        <div
          className="absolute rounded-[10px] px-[20px] py-[18px]"
          style={{
            top: 292,
            left: 56,
            width: 268,
            background: "rgba(255,255,255,0.55)",
            border: `1.5px solid ${GOLD}`,
            zIndex: 2,
          }}
        >
          <Field label="Date Of Test" value={testDate} />
          <Field label="Reference No." value={referenceNo} />
          <Field label="Remarks" value={remarks} last />
        </div>

        <div
          className="absolute text-center"
          style={{ top: 196, left: 352, right: 56, zIndex: 2 }}
        >
          <p
            className="text-[17px] text-[#222]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
          >
            {openingLine}
          </p>
          <h1
            className="mt-[10px] text-[48px] leading-none font-extrabold tracking-[0.04em] uppercase"
            style={{ color: ORANGE }}
          >
            {candidateName}
          </h1>
          <p className="mx-auto mt-[12px] max-w-[620px] text-[15px] leading-[1.45] text-[#222]">
            {statement}
          </p>
          <div className="mt-[16px] flex justify-center">
            <span
              className="inline-flex max-w-full rounded-full px-[28px] py-[9px] text-[16px] font-bold tracking-[0.08em] text-white uppercase"
              style={{ background: NAVY }}
            >
              <span className="truncate">{jobTitle}</span>
            </span>
          </div>

          <div
            className="mx-auto mt-[22px] grid grid-cols-3 overflow-hidden rounded-[10px]"
            style={{
              width: 520,
              border: `1.5px solid ${GOLD}`,
              background: "rgba(255,255,255,0.72)",
            }}
          >
            <ScoreCell label="TOTAL MARKS" value={totalMarks} />
            <ScoreCell label="MARKS OBTAINED" value={marksObtained} divider />
            <ScoreCell label="GRADE" value={grade} divider />
          </div>
        </div>

        <div
          className="absolute"
          style={{ left: 56, bottom: 48, width: 430, zIndex: 2 }}
        >
          <p className="text-[12px] font-extrabold tracking-[0.08em] uppercase">
            The following points were considered
          </p>
          <p className="mt-[8px] text-[12px] leading-[1.5] text-[#333]">
            {pointsConsidered}
          </p>
        </div>

        <img
          src={DEFAULT_SEAL}
          alt=""
          className="absolute object-contain"
          style={{
            left: "50%",
            bottom: 22,
            width: 128,
            height: 210,
            transform: "translateX(-50%)",
            zIndex: 3,
          }}
        />

        <div
          className="absolute flex flex-col items-center"
          style={{ left: 860, bottom: 72, width: 240, zIndex: 2 }}
        >
          {signatureImageUrl ? (
            <img
              src={signatureImageUrl}
              alt=""
              className="mb-[2px] h-[46px] w-auto max-w-full object-contain"
            />
          ) : (
            <svg
              viewBox="0 0 180 44"
              className="mb-[2px] h-[44px] w-[180px] text-[#111]"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 30c18-18 28 2 44-8 14-9 18 15 36 6 14-7 20-20 34-13 12 6 14 18 28 11 9-4 16-16 28-9"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          )}
          <div className="h-[1px] w-full bg-[#111]" />
          <p className="mt-[6px] text-[14px] text-[#444]">{signatureText}</p>
        </div>

        <img
          src={qrSrc}
          alt="Certificate QR code"
          className="absolute bg-white object-contain"
          style={{ right: 56, bottom: 48, width: 96, height: 96, zIndex: 2 }}
        />
      </article>
    </div>
  );
}

function Field({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-[16px]"}>
      <p className="text-[13px] font-semibold" style={{ color: ORANGE }}>
        {label}
      </p>
      <p className="mt-[3px] text-[15px] leading-tight font-semibold">{value}</p>
    </div>
  );
}

function ScoreCell({
  label,
  value,
  divider = false,
}: {
  label: string;
  value: number | string;
  divider?: boolean;
}) {
  return (
    <div
      className={cn("px-[10px] py-[14px] text-center", divider && "border-l")}
      style={divider ? { borderLeftColor: "#d6d3d1" } : undefined}
    >
      <p
        className="text-[10px] font-bold tracking-[0.1em]"
        style={{ color: LABEL_GRAY }}
      >
        {label}
      </p>
      <p
        className="mt-[6px] text-[30px] leading-none font-extrabold"
        style={{ color: NAVY }}
      >
        {value}
      </p>
    </div>
  );
}

export const SAMPLE_TEST_REPORT: TestReportCertificateProps = {
  reportNumber: "TR 0016334",
  candidateName: "SAQIB AHMED",
  jobTitle: "GENERAL ELECTRICIAN",
  testDate: "March 11, 2026",
  referenceNo: "TNT-R/DSTTI,P/68",
  remarks: "A+ Grade",
  totalMarks: 100,
  marksObtained: 80,
  grade: "A+",
  pointsConsidered:
    "Install, maintains, adjust and repairs electrical wiring systems, fixtures, motors, generators, apparatus and control equipment. Interprets drawings and performs trade calculations for safe installation.",
  heading: "TEST REPORT",
  openingLine: "This is to Certify that",
  statement:
    "has successfully appeared in the TECH-NI-TEST Trade Test conducted for the post of",
  qrValue: "TR 0016334",
  sealLabel: "BEGINNER",
  signatureText: "Signature",
};
