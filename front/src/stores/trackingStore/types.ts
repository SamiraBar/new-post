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

  draftedAt?: Date | null;
  createdAt?: Date | null;
  acceptedAt?: Date | null;
  shippedAt?: Date | null;

  draftedAtFormatted?: string | null;
  createdAtFormatted?: string | null;
  acceptedAtFormatted?: string | null;
  shippedAtFormatted?: string | null;

  senderFullName?: string;
  recipientFullName?: string;
  recipientPhoneNumber?: string;
}
