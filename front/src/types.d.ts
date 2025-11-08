export interface Admin {
  _id: string;
  email: string;
  token: string;
}

export interface GlobalError {
  error: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface Office {
  id: number;
  name: string;
  address: string;
}

export interface CalculatorState {
  weight: number;
  value: number;
  deliveryCost: number;
  insuranceCost: number;
  totalCost: number;
}
