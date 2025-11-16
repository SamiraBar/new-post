export interface TrackingStatus {
  status: string;
  date: string;
  time?: string;
  location?: string;
}

export interface ParcelInfo {
  _id: string;
  trackingNumber: string;
  partnerTrackingNumber?: string;
  sender: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
  };
  recipient: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
  };
  originCity: string;
  destinationCity: string;
  status: 'draft' | 'created' | 'accepted' | 'shipped';
  weight: number;
  isPaid: boolean;
  partnerStickerReceived: boolean;
  timeline: {
    draft: { date: string; timestamp: Date } | null;
    created: { date: string; timestamp: Date } | null;
    accepted: { date: string; timestamp: Date } | null;
    shipped: { date: string; timestamp: Date } | null;
  };
  senderFullName?: string;
  recipientFullName?: string;
  recipientPhoneNumber?: string;
}
