export interface Pvz {
  code: string;
  name: string;
  address?: string;
  phone?: string;
  worktime?: string;
  maxweight?: number;
  acceptcash?: boolean;
  acceptcard?: boolean;
  acceptfitting?: boolean;
  latitude: number;
  longitude: number;
}

export interface PvzFilters {
  search: string;
  acceptcash: boolean;
  acceptcard: boolean;
  acceptfitting: boolean;
}

export interface PvzState {
  pvzList: Pvz[];
  selectedPvz: Pvz | null;
  loading: boolean;
  error: string | null;
  filters: PvzFilters;

  fetchPvz: (params: { city: string; weight?: number }) => Promise<void>;
  setSelectedPvz: (pvz: Pvz | null) => void;
  setSearch: (term: string) => void;
  toggleFilter: (key: keyof Omit<PvzFilters, "search">) => void;
  clear: () => void;
}
