
export type Event = {
  id: number;
  attributes: {
    description: string;
    price: number;
    ticketsAmount: number;
    createdAt: string;
    updatedAt: string;
    ticketsLeft: number | null;
    date: string;
    name: string;
    location: string | null;
  };
}

export type LkEvent = {
  id: number;
  attributes: Event['attributes'] & {
    isPaid: boolean;
  }
}