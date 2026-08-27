export type InvoiceParty = {
  name: string;
  lines: string[];
};

export type InvoiceDiscountLine = {
  label: string;
  amount: string;
};

export type InvoiceDocumentData = {
  id: string | number;
  status: string;
  statusColor: string;
  customerId: string;
  purchaseDate: string;
  billTo: InvoiceParty;
  billFrom: InvoiceParty;
  paymentMethod: string;
  maskedAccount: string;
  accountName: string;
  orderLabel: string;
  orderAmount: string;
  subTotal: string;
  discounts: InvoiceDiscountLine[];
  grossTotal: string;
  total: string;
  receivedPayment: string;
  failureReason?: string | null;
};

const COLORS = {
  text: "#111827",
  muted: "#9ca3af",
  secondary: "#6b7280",
  blue: "#2563eb",
  line: "#eef1f6",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function partyHtml(party: InvoiceParty, align: "left" | "right") {
  const lines = party.lines
    .filter(Boolean)
    .map((line) => `<p class="detail">${escapeHtml(line)}</p>`)
    .join("");
  return `<div class="col ${align}">
      <p class="label">${align === "left" ? "Bill to:" : "Bill from:"}</p>
      <p class="name">${escapeHtml(party.name)}</p>
      ${lines}
    </div>`;
}

export function buildInvoiceHtml(data: InvoiceDocumentData) {
  const discountRows = data.discounts
    .map(
      (item) => `<div class="line">
        <span>${escapeHtml(item.label)}</span>
        <span>${escapeHtml(item.amount)}</span>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice #${escapeHtml(String(data.id))}</title>
  <style>
    @page { size: A4; margin: 22mm 18mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: ${COLORS.text};
      font-family: Arial, Helvetica, sans-serif;
      background: #fff;
    }
    .invoice { max-width: 720px; margin: 0 auto; }
    h1 { margin: 0 0 28px; font-size: 22px; font-weight: 700; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
    .col.right, .right { text-align: right; }
    .label { margin: 0; color: ${COLORS.muted}; font-size: 13px; }
    .value { margin: 4px 0 0; font-size: 14px; font-weight: 500; }
    .name { margin: 6px 0 2px; font-size: 14px; font-weight: 700; }
    .detail { margin: 2px 0; font-size: 14px; }
    .muted { color: ${COLORS.secondary}; font-size: 14px; margin: 0; }
    .blue { color: ${COLORS.blue}; }
    .status { font-size: 14px; font-weight: 600; }
    .sep { border: 0; height: 1px; background: ${COLORS.line}; margin: 20px 0; }
    .line { display: flex; justify-content: space-between; gap: 16px; margin-top: 12px; font-size: 14px; }
    .line.heads { margin-top: 0; color: ${COLORS.muted}; }
    .strong { font-weight: 700; }
    .received { color: ${COLORS.blue}; font-weight: 700; }
    .fail { color: #ef4444; font-size: 14px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="invoice">
    <h1>Invoice</h1>
    <div class="row">
      <div>
        <p class="label">Order ID#</p>
        <p class="value blue strong">${escapeHtml(String(data.id))}</p>
      </div>
      <p class="status" style="color:${escapeHtml(data.statusColor)}">${escapeHtml(data.status)}</p>
    </div>
    <hr class="sep" />
    <div class="row">
      <div>
        <p class="label">Customer ID#</p>
        <p class="value">${escapeHtml(data.customerId)}</p>
      </div>
      <div class="right">
        <p class="label">Purchase Date</p>
        <p class="value">${escapeHtml(data.purchaseDate)}</p>
      </div>
    </div>
    <hr class="sep" />
    <div class="row">
      ${partyHtml(data.billTo, "left")}
      ${partyHtml(data.billFrom, "right")}
    </div>
    <hr class="sep" />
    <div class="row">
      <div>
        <p class="label">Payment Method:</p>
        <p class="name">${escapeHtml(data.paymentMethod)}</p>
      </div>
      <div class="right">
        <p class="muted">${escapeHtml(data.maskedAccount)}</p>
        <p class="name">${escapeHtml(data.accountName)}</p>
      </div>
    </div>
    <hr class="sep" />
    <div class="line heads"><span>Order</span><span>Amount</span></div>
    <div class="line"><span>${escapeHtml(data.orderLabel)}</span><span>${escapeHtml(data.orderAmount)}</span></div>
    <div class="line strong"><span>Sub Total</span><span>${escapeHtml(data.subTotal)}</span></div>
    <hr class="sep" />
    <p class="label">Discounts</p>
    ${discountRows}
    <div class="line strong"><span>Gross Total</span><span>${escapeHtml(data.grossTotal)}</span></div>
    <hr class="sep" />
    <div class="line strong"><span>Total</span><span>${escapeHtml(data.total)}</span></div>
    <div class="line received"><span>Received Payment</span><span>${escapeHtml(data.receivedPayment)}</span></div>
    ${
      data.failureReason
        ? `<hr class="sep" /><p class="label">Failure Reason</p><p class="fail">${escapeHtml(data.failureReason)}</p>`
        : ""
    }
  </div>
</body>
</html>`;
}

export function printInvoice(data: InvoiceDocumentData) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(buildInvoiceHtml(data));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function pdfText(value: string) {
  return value.replace(/[^\u0020-\u007E]/g, " ").replace(/\s+/g, " ").trim();
}

function hexRgb(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function textWidth(value: string, size: number, bold = false) {
  return value.length * size * (bold ? 0.58 : 0.5);
}

function padOffset(offset: number) {
  return String(offset).padStart(10, "0");
}

function buildInvoicePdf(data: InvoiceDocumentData) {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 48;
  const right = pageWidth - margin;
  const commands: string[] = [];
  let y = 56;

  const pdfY = (fromTop = y) => pageHeight - fromTop;

  function drawText(
    raw: string,
    x: number,
    fromTop: number,
    size: number,
    options: { bold?: boolean; color?: string; align?: "left" | "right" } = {},
  ) {
    const text = pdfText(raw) || "--";
    const color = hexRgb(options.color ?? COLORS.text);
    const font = options.bold ? "/F2" : "/F1";
    const posX =
      options.align === "right" ? x - textWidth(text, size, options.bold) : x;
    commands.push(
      "BT",
      `${color} rg`,
      `${font} ${size} Tf`,
      `1 0 0 1 ${posX.toFixed(2)} ${pdfY(fromTop).toFixed(2)} Tm`,
      `(${pdfEscape(text)}) Tj`,
      "ET",
    );
  }

  function drawLine() {
    y += 12;
    commands.push(
      `${hexRgb(COLORS.line)} RG`,
      "0.6 w",
      `${margin} ${pdfY().toFixed(2)} m ${right.toFixed(2)} ${pdfY().toFixed(2)} l S`,
    );
    y += 20;
  }

  function drawAmountRow(
    label: string,
    amount: string,
    options: { bold?: boolean; color?: string; size?: number } = {},
  ) {
    const size = options.size ?? 11;
    drawText(label, margin, y, size, {
      bold: options.bold,
      color: options.color,
    });
    drawText(amount, right, y, size, {
      bold: options.bold,
      color: options.color,
      align: "right",
    });
    y += 18;
  }

  drawText("Invoice", margin, y, 20, { bold: true });
  y += 36;

  drawText("Order ID#", margin, y, 10, { color: COLORS.muted });
  drawText(data.status, right, y, 11, {
    bold: true,
    color: data.statusColor,
    align: "right",
  });
  y += 16;
  drawText(String(data.id), margin, y, 12, { bold: true, color: COLORS.blue });
  y += 10;
  drawLine();

  drawText("Customer ID#", margin, y, 10, { color: COLORS.muted });
  drawText("Purchase Date", right, y, 10, {
    color: COLORS.muted,
    align: "right",
  });
  y += 16;
  drawText(data.customerId, margin, y, 11, { bold: true });
  drawText(data.purchaseDate, right, y, 11, { bold: true, align: "right" });
  y += 10;
  drawLine();

  drawText("Bill to:", margin, y, 10, { color: COLORS.muted });
  drawText("Bill from:", right, y, 10, { color: COLORS.muted, align: "right" });
  y += 16;
  drawText(data.billTo.name, margin, y, 11, { bold: true });
  drawText(data.billFrom.name, right, y, 11, { bold: true, align: "right" });
  const billLines = Math.max(data.billTo.lines.length, data.billFrom.lines.length);
  for (let i = 0; i < billLines; i += 1) {
    y += 15;
    if (data.billTo.lines[i]) drawText(data.billTo.lines[i], margin, y, 11);
    if (data.billFrom.lines[i]) {
      drawText(data.billFrom.lines[i], right, y, 11, { align: "right" });
    }
  }
  y += 10;
  drawLine();

  drawText("Payment Method:", margin, y, 10, { color: COLORS.muted });
  drawText(data.maskedAccount, right, y, 11, {
    color: COLORS.secondary,
    align: "right",
  });
  y += 16;
  drawText(data.paymentMethod, margin, y, 11, { bold: true });
  drawText(data.accountName, right, y, 11, { bold: true, align: "right" });
  y += 10;
  drawLine();

  drawAmountRow("Order", "Amount", { color: COLORS.muted, size: 10 });
  y += 2;
  drawAmountRow(data.orderLabel, data.orderAmount);
  drawAmountRow("Sub Total", data.subTotal, { bold: true });
  y -= 2;
  drawLine();

  drawText("Discounts", margin, y, 10, { color: COLORS.muted });
  y += 18;
  data.discounts.forEach((item) => drawAmountRow(item.label, item.amount));
  drawAmountRow("Gross Total", data.grossTotal, { bold: true });
  y -= 2;
  drawLine();

  drawAmountRow("Total", data.total, { bold: true });
  drawAmountRow("Received Payment", data.receivedPayment, {
    bold: true,
    color: COLORS.blue,
  });

  if (data.failureReason) {
    y += 6;
    drawLine();
    drawText("Failure Reason", margin, y, 10, { color: COLORS.muted });
    y += 16;
    drawText(data.failureReason, margin, y, 11, { color: "#ef4444" });
  }

  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Count 1 /Kids [5 0 R] >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents 6 0 R >>`,
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

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

export function downloadInvoicePdf(data: InvoiceDocumentData) {
  const blob = buildInvoicePdf(data);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `invoice-${data.id}.pdf`;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
