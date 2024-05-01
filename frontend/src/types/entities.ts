import { APIResponse, APIResponseCollection } from "./types";

export type Settings =
  APIResponse<"api::nastrojki.nastrojki">["data"]["attributes"] & {
    city: string | null
  };

export type Event =
  APIResponseCollection<"api::event.event">["data"][number];

