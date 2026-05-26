export type UserGender = "MALE" | "FEMALE";
export type UserRole = "ADMIN" | "USER" | "STAFF";

export type User = {
  id: number;
  email: string;
  user_name: string;
  gender: UserGender;
  full_name: string;
  first_name: string;
  last_name: string;
  image: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_vehicle_number: string | null;
  rate: number;
  rank: string;
  device_token: string | null;
  info: UserInfo;
  customer_info: unknown[];
  review_info: unknown | null;
  birth_day: string | null;
  license: string | null;
  identity_card: string | null;
};

export type UserConfig = {
  DAT: string;
  TIM: string;
  TMZ: string;
  NUM: string;
  CUR: string;
  TAX: string;
  KM_SUGGEST_SHIPPER: string;
  TIMEOUT_SUGGEST_SHIP: string;
  SHIP_LOC_M: string;
  KM_UPDATE_PICKUP_ADD: string;
  DIS_DEL_LOC: string;
  M_HUB_SHIPPER: string;
  LOD: string;
  RMAT: string;
  RMIT: string;
  RKPI: string;
  OPKA: string;
  ODRC: string;
  DSWH: string;
  MWOR: string;
  DSPO: string;
  ESRO: string;
  RCRT: string;
  DACS: string;
  NCOI: string;
  PHOF: string;
  PHOT: string;
  FUEL: string;
  DKPT: string;
  HL: string;
  F_ITEM_WEIGHT_1: string;
  F_ITEM_WEIGHT_2: string;
  ZALO_OA_ID: string;
};

export type HubManager = {
  name: string;
  phone: string;
};

export type HubContactPerson = {
  name: string;
  email: string;
  phone: string;
};

export type CurrentHub = {
  id: number;
  name: string;
  code: string;
  warehouse_code: string;
  status_code?: string;
  address?: string;
  ward_code?: string;
  ward_name?: string;
  district_code?: string;
  district_name?: string;
  state_code?: string;
  state_name?: string;
  country_name?: string;
  full_address?: string;
  manage_by?: HubManager | null;
  contact_person?: HubContactPerson[];
  description?: string | null;
  location?: string;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  deleted?: number;
  manage_by_id?: number | null;
  zone_hub_id?: number | null;
  is_create_app?: number;
  org_id?: number | null;
};

export type UserInfo = {
  language: string;
  configs: UserConfig;
  roles: UserRole[];
  customer_info: unknown[];
  current_hub: CurrentHub | null;
};