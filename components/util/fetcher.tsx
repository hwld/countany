// eslint-disable-next-line @typescript-eslint/ban-types
type Fetcher = (url: string, data?: Object) => Promise<any>;

export const fetcher: Fetcher = (url: string, data = undefined) =>
  fetch(window.location.origin + url, {
    method: data ? "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());
