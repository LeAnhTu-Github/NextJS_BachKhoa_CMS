export const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
  ) => {
    const token = localStorage.getItem("auth-token");
  
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw await res.json();
    return res.json();
  };
  