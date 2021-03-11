import useSWR, { responseInterface } from "swr";
import { Counter } from "../models/counter";

type Fetcher = <T>(url: string, data?: T) => Promise<T>;
type Post = <T>(url: string, data?: T) => Promise<Response>;

const fetcher: Fetcher = (url) =>
  fetch(window.location.origin + url, {
    method: "GET",
    credentials: "include",
  }).then((r) => r.json());

const post: Post = (url, data) => {
  return fetch(window.location.origin + url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const useFetchCounter = (): responseInterface<Counter[], Error> =>
  useSWR<Counter[]>("/api/counters", fetcher);

export const postCreateCounter = (counter: Counter): Promise<Response> =>
  post("/api/counter/create", { ...counter, id: "" });

export const postBulkCreateCounters = (
  counters: Counter[]
): Promise<Response> => post("/api/counters/bulk_create", counters);

export const postRemoveCounter = (id: string): Promise<Response> =>
  post("/api/counter/delete", { id });

export const postUpdateCounter = (counter: Counter): Promise<Response> =>
  post("/api/counter/update", counter);
