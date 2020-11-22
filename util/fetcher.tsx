export type Fetcher = <T>(url: string, data?: T) => Promise<T>;

export const fetcher: Fetcher = (url, data) =>
  fetch(window.location.origin + url, {
    method: data ? "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());
