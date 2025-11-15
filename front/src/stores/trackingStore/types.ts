export interface TrackingStatus {
  date: string;
  time: string;
  status: string;
  location?: string;
}

export interface ParcelInfo {
  trackNumber: string;
  sender: {
    location: string;
    address: string;
  };
  recipient: {
    location: string;
    address: string;
  };
  statuses: TrackingStatus[];
  currentStatus: string;
  isDelivered: boolean;
}
