export interface AdminDef {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

export interface CourierCityRow {
    "Название города": string;
    "Страна"?: string;
}

export interface PickupCityRow {
    "Название города": string;
    "Регион"?: string;
}