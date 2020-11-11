import { Counter } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "./fetcher";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useCounters() {
  const { data: counters, mutate } = useSWR<Counter[]>(
    "/api/counters",
    fetcher
  );
  return { counters: counters || [], mutate };
}
