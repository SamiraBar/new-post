import Parcel from "../models/Parcel";

export async function generateTrackingNumber(): Promise<string> {
    const lastParcel = await Parcel
        .findOne({ trackingNumber: /^KGZ-\d{6}$/ })
        .sort({ trackingNumber: -1 })
        .select("trackingNumber")
        .lean();

    let nextNumber = 1;

    if (lastParcel?.trackingNumber) {
        const numericPart = Number(lastParcel.trackingNumber.replace("KGZ-", ""));
        nextNumber = numericPart + 1;
    }

    const padded = String(nextNumber).padStart(6, "0");
    return `KGZ-${padded}`;
}
