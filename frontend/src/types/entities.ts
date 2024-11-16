import { BlocksContent } from "@strapi/blocks-react-renderer";
import { APIResponse, APIResponseCollection } from "./types";

export type Settings =
  APIResponse<"api::nastrojki.nastrojki">["data"]["attributes"] & {
    city: string | null;
  };


export type Event = {
  id: number;
  attributes: {
    description: string;
    price: number;
    ticketsAmount: number;
    createdAt: string;
    updatedAt: string;
    ticketsLeft: number;
    date: string;
    name: string;
    location: string;
    tags: Tag[];
    speakers: {data: Speaker[]};
    image: {data: Image | null};
    city: {data: City | null};
    options: Option[];
  };
}

type Tag = {
  id: number;
  name: string;
}

export type Speaker = {
  id: number;
  attributes: {
    name: string;
    workplace: string;
    bio: BlocksContent | null;
    createdAt: string;
    updatedAt: string;
    avatar: {data: Image | null};
  };
}

export type Image = {
  id: number;
  attributes: {
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
      thumbnail: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string;
        width: number;
        height: number;
        size: number;
        url: string;
      };
      small: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: string;
        width: number;
        height: number;
        size: number;
        url: string;
      };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    provider_metadata: string;
    createdAt: string;
    updatedAt: string;
    placeholder?: string;
  };
}

export type City = {
  id: number;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
    isEnabled: boolean;
  };
}

export type Option = {
  id: number;
  name: string;
  price: number;
  ticketsAmount: number;
  ticketsLeft: number;
}


export type Order = {
  phone: string;
  option_id: number;
  first_name: string;
  last_name: string;
  second_name: string;
  email: string;
  workplace: string;
  custom_position: string | null;
  custom_speciality: string | null;
  createdAt: string;
  updatedAt: string;
  is_paid: boolean;
  sberbank_order_id: string | undefined;
  price: number;
  option_name: string;
  sberbank_payment_url: string | undefined;
}

export type SanitizedOrder = {
  event_name: string;
  option_name: string;
  phone: string;
  first_name: string;
  last_name: string;
  second_name: string;
  email: string;
  price: number;
  is_paid: boolean;
  sberbank_order_id: string | undefined;
  sberbank_payment_url: string | undefined;
  bonuses: number;
  workplace: string;
  position: string;
  speciality: string;
}

export type SanitizedLegalOrder = {
  event_name: string;
  option_name: string;
  name: string;
  phone: string;
  company: string;
  email: string;
  companyFull: string;
  speciality: string;
  position: string;
}

export type LkEvent = {
  id: number;
  attributes: Event['attributes'];
  order: Order;
}


export type PhotoAlbum = {
  id: number;
  attributes: {
    name: string;
    description: string;
    link: string;
    cover: {data: Image | null};
  };
}