export interface AdminDef {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

export interface CourierCityRow {
    "City Name": string;
    "Country"?: string;
}

export interface PickupCityRow {
    "City Name": string;
    "Region"?: string;
}