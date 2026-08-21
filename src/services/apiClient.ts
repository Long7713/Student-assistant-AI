export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiClient<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 20000, headers = {}, signal, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Link caller signal if present
  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData?.error || errorData?.message) {
          errorMessage = errorData.error || errorData.message;
        }
      } catch {
        // use default message
      }
      throw new ApiError(errorMessage, response.status);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new ApiError("Yêu cầu đã bị hủy hoặc quá thời gian chờ (Timeout).");
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Lỗi kết nối mạng, vui lòng thử lại.");
  }
}
