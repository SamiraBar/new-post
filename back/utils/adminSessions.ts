import Admin from "../models/Admin";

export const getActiveAdminsCount = async (): Promise<number> => {
    const activeAdmins = await Admin.countDocuments({
        isActive: true,
        role: { $ne: "superAdmin" }
    });

    return activeAdmins;
};