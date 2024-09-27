export type UserBonuses = {
  eventsVisited: number;
  bonuses: number;
}

export type Level = { 
  name: string;
  color: string;
  cashbackPercent: number;
  requiredEventsVisits: number;
  additionalBonuses: string[];
}

export type BonusPage = {
  levels: Level[];
  userBonuses: UserBonuses;
}

