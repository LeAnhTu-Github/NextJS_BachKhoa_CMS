const API_BASE_URL = "http://103.147.34.20:19800";

export async function GET(request, { params }) {
  const awaitedParams = await params;
  return forwardRequest(request, awaitedParams, "GET");
}

export async function POST(request, { params }) {
  const awaitedParams = await params;
  return forwardRequest(request, awaitedParams, "POST");
}

export async function PUT(request, { params }) {
  const awaitedParams = await params;
  return forwardRequest(request, awaitedParams, "PUT");
}

export async function DELETE(request, { params }) {
  const awaitedParams = await params;
  return forwardRequest(request, awaitedParams, "DELETE");
}

export async function PATCH(request, { params }) {
  const awaitedParams = await params;
  return forwardRequest(request, awaitedParams, "PATCH");
}

async function forwardRequest(request, params, method) {
  try {
    // Lấy path từ params
    const path = params.path ? params.path.join("/") : "";

    // Lấy query string từ URL
    const url = new URL(request.url);
    const queryString = url.search;

    // Tạo URL đích
    const targetUrl = `${API_BASE_URL}/${path}${queryString}`;

    // Lấy headers từ request gốc (loại bỏ một số headers không cần thiết)
    const headers = {};
    request.headers.forEach((value, key) => {
      if (
        !["host", "connection", "content-length"].includes(key.toLowerCase())
      ) {
        headers[key] = value;
      }
    });

    // Tạo request options
    const requestOptions = {
      method: method,
      headers: headers,
    };

    // Thêm body cho POST, PUT, PATCH
    if (["POST", "PUT", "PATCH"].includes(method)) {
      requestOptions.body = await request.text();
    }

    // Gửi request đến API backend
    const response = await fetch(targetUrl, requestOptions);

    // Lấy response data
    const data = await response.text();

    // Tạo response mới với same status và headers
    const newResponse = new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        // Copy các headers cần thiết khác
        ...Object.fromEntries(
          [...response.headers.entries()].filter(
            ([key]) =>
              !["content-length", "transfer-encoding"].includes(
                key.toLowerCase()
              )
          )
        ),
      },
    });

    return newResponse;
  } catch (error) {
    console.error("API Proxy Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
