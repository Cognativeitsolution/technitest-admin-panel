export type Country = {
  id: number;
  name: string;
  code?: string;
  iso2?: string;
};

export type State = {
  id: number;
  name: string;
  country_id?: number;
};

export type City = {
  id: number;
  name: string;
  state_id?: number;
  country_id?: number;
};
