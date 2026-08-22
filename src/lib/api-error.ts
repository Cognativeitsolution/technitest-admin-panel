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

  static fromAxiosError(error: any): ApiError {
    if (error instanceof ApiError) return error;

    const res = error?.response;
    const data = res?.data;
    const statusCode = res?.status || 500;
    const message =
      data?.message ||
      data?.error ||
      error?.message ||
      "An unexpected error occurred";

    const fieldErrors: Record<string, string> = {};
    const rawErrors = data?.errors || data?.response?.errors;

    if (Array.isArray(rawErrors)) {
      rawErrors.forEach((err: any) => {
        const field = err?.field || (Array.isArray(err?.loc) ? err.loc[err.loc.length - 1] : null);
        if (field && (err?.message || err?.msg)) {
          fieldErrors[field] = err.message || err.msg;
        }
      });
    } else if (rawErrors && typeof rawErrors === "object") {
      Object.entries(rawErrors).forEach(([key, val]) => {
        fieldErrors[key] = Array.isArray(val) ? String(val[0]) : String(val);
      });
    }

    return new ApiError(message, statusCode, fieldErrors);
  }
}
