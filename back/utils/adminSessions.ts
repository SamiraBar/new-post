import Admin from "../models/Admin";

export const getActiveAdminsCount = async (): Promise<number> => {
    const activeAdmins = await Admin.find({ isActive: true });
    return activeAdmins.length;
};
