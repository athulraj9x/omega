// utils/formatUserData.js

module.exports = function formatUserData(user) {
    if (!user) return null;

    return {
        id: user?._id,
        username: user?.username,
        profile_pic: user?.profile_pic,
        name: user?.first_name + " " + user?.last_name,
        email: user?.email,
        mobileNo: user?.mobile_no,
        guest_login: user?.guest_login,
        device_code: user?.device_code,
        status: user?.status,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
        email_verified: user?.email_verify || null,
        ip_address: user?.ip_address || {},
        role: user?.role,
        roleLevel: user?.roleLevel,
        last_login: user?.last_login || null,
        wallet: {
            coin: user?.wallet_id?.coin || 0,
            diamond: user?.wallet_id?.diamond || 0,
        },
    };
};
