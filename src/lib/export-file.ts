function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const lines = [headers, ...rows].map((row) => row.map((cell) => csvCell(cell ?? "")).join(","));
  const blob = new Blob([`\uFEFF${lines.join("\r\n")}\r\n`], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function pdfText(value: string) {
  return value.replace(/[^\u0020-\u007E]/g, " ").replace(/\s+/g, " ").trim();
}

function fitText(value: string, maxWidth: number, fontSize: number) {
  const cleaned = pdfText(value) || "--";
  const maxChars = Math.max(3, Math.floor(maxWidth / (fontSize * 0.5)) - 1);
  if (cleaned.length <= maxChars) return cleaned;
  return `${cleaned.slice(0, Math.max(1, maxChars - 3))}...`;
}

function padOffset(offset: number) {
  return String(offset).padStart(10, "0");
}

function buildPdf(title: string, headers: string[], rows: string[][]) {
  const pageWidth = 842;
  const pageHeight = 595;
  const margin = 36;
  const fontSize = 8;
  const titleSize = 14;
  const lineHeight = 16;
  const colCount = Math.max(1, headers.length);
  const usableWidth = pageWidth - margin * 2;
  const colWidth = usableWidth / colCount;
  const headerY = pageHeight - 72;
  const firstRowY = headerY - lineHeight;
  const minY = 40;
  const rowsPerPage = Math.max(1, Math.floor((firstRowY - minY) / lineHeight));
  const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage) || 1);

  function pageStream(pageIndex: number) {
    const commands: string[] = [
      "BT",
      `/F2 ${titleSize} Tf`,
      `1 0 0 1 ${margin} ${pageHeight - 42} Tm`,
      `(${pdfEscape(fitText(title, usableWidth, titleSize))}) Tj`,
      "ET",
      "BT",
      `/F2 ${fontSize} Tf`,
    ];

    headers.forEach((header, col) => {
      const x = margin + col * colWidth;
      commands.push(`1 0 0 1 ${x.toFixed(2)} ${headerY} Tm`);
      commands.push(`(${pdfEscape(fitText(header, colWidth - 8, fontSize))}) Tj`);
    });
    commands.push("ET");
    commands.push("0.7 w");
    commands.push(`${margin} ${headerY - 4} m ${pageWidth - margin} ${headerY - 4} l S`);
    commands.push("BT");
    commands.push(`/F1 ${fontSize} Tf`);

    const start = pageIndex * rowsPerPage;
    rows.slice(start, start + rowsPerPage).forEach((row, rowIndex) => {
      const y = firstRowY - rowIndex * lineHeight;
      row.forEach((cell, col) => {
        const x = margin + col * colWidth;
        commands.push(`1 0 0 1 ${x.toFixed(2)} ${y} Tm`);
        commands.push(`(${pdfEscape(fitText(cell ?? "", colWidth - 8, fontSize))}) Tj`);
      });
    });

    commands.push("ET");
    commands.push("BT");
    commands.push("/F1 8 Tf");
    commands.push(`1 0 0 1 ${pageWidth - 80} 24 Tm`);
    commands.push(`(${pdfEscape(`Page ${pageIndex + 1} of ${pageCount}`)}) Tj`);
    commands.push("ET");

    return commands.join("\n");
  }

  const streams = Array.from({ length: pageCount }, (_, index) => pageStream(index));
  const pageObjectNumbers = streams.map((_, index) => 5 + index * 2);

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Count ${pageCount} /Kids [${pageObjectNumbers.map((num) => `${num} 0 R`).join(" ")}] >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];

  streams.forEach((stream, index) => {
    const contentNumber = 6 + index * 2;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`,
    );
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  const header = "%PDF-1.4\n";
  const parts: string[] = [header];
  const offsets = [0];
  let cursor = header.length;

  objects.forEach((object, index) => {
    const serialized = `${index + 1} 0 obj\n${object}\nendobj\n`;
    offsets.push(cursor);
    parts.push(serialized);
    cursor += serialized.length;
  });

  const xrefLines = ["xref", `0 ${objects.length + 1}`, "0000000000 65535 f "];
  for (let i = 1; i <= objects.length; i += 1) {
    xrefLines.push(`${padOffset(offsets[i])} 00000 n `);
  }

  const document = `${parts.join("")}${xrefLines.join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${cursor}\n%%EOF\n`;
  return new Blob([document], { type: "application/pdf" });
}

export function downloadPdf(filename: string, title: string, headers: string[], rows: string[][]) {
  triggerDownload(buildPdf(title, headers, rows), filename);
}
