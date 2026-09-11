type RawValidationError = {
  field?: string;
  loc?: string[];
  message?: string;
  msg?: string;
  ctx?: {
    error?: string;
  };
};

function normalizeValidationMessage(errorItem: RawValidationError): string | null {
  if (errorItem.ctx?.error) {
    return String(errorItem.ctx.error).trim();
  }

  const rawMessage = errorItem.message || errorItem.msg;
  if (!rawMessage) return null;

  return String(rawMessage).replace(/^Value error,\s*/i, "").trim();
}

function getValidationField(errorItem: RawValidationError): string | null {
  if (errorItem.field) return errorItem.field;
  if (!Array.isArray(errorItem.loc) || errorItem.loc.length === 0) return null;
  return String(errorItem.loc[errorItem.loc.length - 1]);
}

export class ApiError extends Error {
  public statusCode: number;
  public fieldErrors: Record<string, string>;

  constructor(
    message: string,
    statusCode = 500,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }

  static fromAxiosError(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    const axiosError = error as {
      code?: string;
      message?: string;
      response?: {
        status?: number;
        data?: {
          message?: string;
          error?: string;
          errors?: RawValidationError[];
          response?: {
            errors?: RawValidationError[];
          };
        };
      };
    };

    const res = axiosError?.response;
    const data = res?.data;
    const timedOut =
      axiosError?.code === "ECONNABORTED" ||
      /timeout of \d+ms exceeded/i.test(String(axiosError?.message ?? ""));
    const statusCode = res?.status || (timedOut ? 408 : 500);

    const fieldErrors: Record<string, string> = {};
    const rawErrors = data?.errors || data?.response?.errors;
    const detailedMessages: string[] = [];

    if (Array.isArray(rawErrors)) {
      rawErrors.forEach((err) => {
        const normalizedMessage = normalizeValidationMessage(err);
        const field = getValidationField(err);

        if (field && normalizedMessage) {
          fieldErrors[field] = normalizedMessage;
        }

        if (normalizedMessage) {
          detailedMessages.push(normalizedMessage);
        }
      });
    } else if (rawErrors && typeof rawErrors === "object") {
      Object.entries(rawErrors).forEach(([key, val]) => {
        const normalizedMessage = Array.isArray(val) ? String(val[0]) : String(val);
        fieldErrors[key] = normalizedMessage.replace(/^Value error,\s*/i, "").trim();
        detailedMessages.push(fieldErrors[key]);
      });
    }

    let message = timedOut
      ? "The request took too long. Try a smaller image, or turn off network throttling in DevTools."
      : data?.message || data?.error || axiosError?.message || "An unexpected error occurred";

    if (detailedMessages.length > 0) {
      message = [...new Set(detailedMessages)].join(" ");
    }

    return new ApiError(message, statusCode, fieldErrors);
  }
}
