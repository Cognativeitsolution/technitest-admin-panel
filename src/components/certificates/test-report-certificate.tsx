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
  signatureImageUrl?: string | null;
  signatureText?: string;
  sealLabel?: string;
  qrValue?: string;
  qrCodeUrl?: string | null;
  className?: string;
};

const W = 1480;
const H = 860;
const NAVY = "#002E5D";
const GOLD = "#C9A227";
const ORANGE = "#E8950A";
const BADGE = "#E87A12";
const LABEL_GRAY = "#8A8F98";

const HEADER_LOGO = "/certificates/header-logo.png";
const DEFAULT_SEAL = "/certificates/seal-beginner.png";
const WATERMARK_BG = "/certificates/watermark-bg.jpg";

function CornerAccents() {
  return (
    <>
      <div
        className="pointer-events-none absolute right-0 top-0 size-0 border-l-[110px] border-t-[110px] border-l-transparent"
        style={{ borderTopColor: GOLD }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 size-0 border-l-[68px] border-t-[68px] border-l-transparent"
        style={{ borderTopColor: NAVY }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-0 border-r-[90px] border-b-[90px] border-r-transparent"
        style={{ borderBottomColor: GOLD }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[6px] w-[120px]"
        style={{ backgroundColor: NAVY }}
      />
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
      : undefined);

  return (
    <div
      ref={frameRef}
      className={cn("relative w-full overflow-hidden", className)}
      data-testid="test-report-certificate"
      style={{ height: H * scale }}
    >
      <article
        className="absolute top-0 left-0 origin-top-left overflow-hidden font-sans text-[#111]"
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

        <div className="absolute" style={{ top: 44, left: 56, zIndex: 2 }}>
          <span
            className="inline-flex items-center rounded-[8px] px-[16px] py-[7px] text-[13px] font-extrabold tracking-[0.12em] text-white uppercase"
            style={{ background: BADGE }}
          >
            {heading}
          </span>
          <p
            className="mt-[16px] text-[11px] font-semibold tracking-[0.16em] uppercase"
            style={{ color: LABEL_GRAY }}
          >
            REPORT NO
          </p>
          <p className="mt-[3px] text-[22px] leading-none font-extrabold text-[#111827]">
            {reportNumber}
          </p>
        </div>

        <img
          src={HEADER_LOGO}
          alt="TECH-NI-TEST"
          className="absolute object-contain object-center"
          style={{
            top: 28,
            left: "50%",
            width: 480,
            height: 108,
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        />

        <div
          className="absolute overflow-hidden rounded-[8px] bg-[#f8fafc]"
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
            <div className="flex h-full items-center justify-center text-[11px] font-semibold tracking-[0.14em] text-[#9ca3af] uppercase">
              Photo
            </div>
          )}
        </div>

        <div
          className="absolute rounded-[10px] bg-white/80 px-[20px] py-[18px]"
          style={{
            top: 288,
            left: 56,
            width: 268,
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
          style={{ top: 188, left: 340, right: 56, zIndex: 2 }}
        >
          <p
            className="text-[16px] text-[#9ca3af]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
            }}
          >
            {openingLine}
          </p>
          <h1
            className="mt-[8px] font-sans text-[50px] leading-none font-extrabold tracking-[0.03em] uppercase"
            style={{ color: ORANGE }}
          >
            {candidateName}
          </h1>
          <p className="mx-auto mt-[10px] max-w-[640px] text-[15px] leading-[1.45] text-[#374151]">
            {statement}
          </p>
          <div className="mt-[14px] flex justify-center">
            <span
              className="inline-flex max-w-full rounded-full px-[30px] py-[9px] text-[15px] font-bold tracking-[0.06em] text-white uppercase"
              style={{ background: NAVY }}
            >
              <span className="truncate">{jobTitle}</span>
            </span>
          </div>

          <div
            className="mx-auto mt-[20px] grid grid-cols-3 overflow-hidden rounded-[10px] bg-white/85"
            style={{
              width: 540,
              border: `1.5px solid ${GOLD}`,
            }}
          >
            <ScoreCell label="TOTAL MARKS" value={totalMarks} />
            <ScoreCell label="MARKS OBTAINED" value={marksObtained} divider />
            <ScoreCell label="GRADE" value={grade} divider />
          </div>
        </div>

        <div
          className="absolute"
          style={{ left: 56, bottom: 44, width: 440, zIndex: 2 }}
        >
          <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#111827] uppercase">
            The following points were considered
          </p>
          <p className="mt-[8px] text-[11px] leading-[1.55] text-[#374151]">
            {pointsConsidered}
          </p>
        </div>

        <img
          src={DEFAULT_SEAL}
          alt=""
          className="absolute object-contain"
          style={{
            left: "50%",
            bottom: 18,
            width: 124,
            height: 200,
            transform: "translateX(-58%)",
            zIndex: 3,
          }}
        />

        <div
          className="absolute flex items-end gap-3"
          style={{ left: 848, bottom: 68, width: 260, zIndex: 2 }}
        >
          <p className="shrink-0 pb-[10px] text-[13px] text-[#9ca3af]">
            Signature
          </p>
          <div className="min-w-0 flex-1">
            {signatureImageUrl ? (
              <img
                src={signatureImageUrl}
                alt=""
                className="mb-[2px] h-[44px] w-full object-contain object-bottom"
              />
            ) : (
              <svg
                viewBox="0 0 180 44"
                className="mb-[2px] h-[44px] w-full text-[#111]"
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
            <div className="h-px w-full bg-[#374151]" />
            {signatureText && signatureText !== "Signature" ? (
              <p className="mt-[4px] text-center text-[12px] font-medium text-[#374151]">
                {signatureText}
              </p>
            ) : null}
          </div>
        </div>

        {qrSrc ? (
          <img
            src={qrSrc}
            alt="Certificate QR code"
            className="absolute bg-white object-contain"
            style={{ right: 56, bottom: 44, width: 96, height: 96, zIndex: 2 }}
          />
        ) : null}
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
      <p className="mt-[3px] text-[15px] leading-tight font-semibold text-[#111827]">
        {value}
      </p>
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
      className={cn("px-[12px] py-[14px] text-center", divider && "border-l")}
      style={divider ? { borderLeftColor: GOLD } : undefined}
    >
      <p
        className="text-[10px] font-bold tracking-[0.08em] uppercase"
        style={{ color: LABEL_GRAY }}
      >
        {label}
      </p>
      <p
        className="mt-[6px] text-[32px] leading-none font-extrabold"
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
    "Install, maintains adjust and repairs electrical wiring systems, fixtures, motors, generators, apparatus and control equipment. Interprets drawings and performs trade calculations for safe installation.",
  heading: "TEST REPORT",
  openingLine: "This is to Certify that",
  statement:
    "has successfully appeared in the TECH-NI-TEST Trade Test conducted for the post of",
  qrValue: "TR 0016334",
  sealLabel: "BEGINNER",
  signatureText: "Signature",
};
