const { axiosInstance } = require(".");

//Verify the received account.

export const VerifyAccount = async (payload) => {
    try {
        const { data } = await axiosInstance.post("/api/transactions/verify-account", payload);
        return data;

    } catch (error) {
        return error.response.data;
    }
}