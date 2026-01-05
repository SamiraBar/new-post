import Parcel from '../models/Parcel';

export const generateTrackingNumber = async (): Promise<string> => {
    const lastParcel = await Parcel.findOne({
        trackingNumber: /^KGZ-\d{6}$/
    })
        .sort({ trackingNumber: -1 })
        .lean();

    let nextNumber = 1;

    if (lastParcel?.trackingNumber) {
        const lastNumber = Number(
            lastParcel.trackingNumber.replace('KGZ-', '')
        );
        nextNumber = lastNumber + 1;
    }

    return `KGZ-${String(nextNumber).padStart(6, '0')}`;
};
