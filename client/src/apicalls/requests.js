import { axiosInstance } from '.';

//get all requests for a users 
export const GetAllRequestsByUser = async () => {
    try {
        const { data } = await axiosInstance.post("/api/requests/get-all-requests-by-user");
        return data;
    } catch (error) {
        console.error("Error in /api/requests/get-all-requests-by-user request", error);
        return error.response.data;
    }
};

// send a requests to another user
export const SendRequests = async (request) => {
    try {
        const { data } = await axiosInstance.post("/api/requests/send-requests", request);
        return data;
    } catch (error) {
        console.error("Error in /api/requests/send-requests request", error);
        return error.response.data;
    }
};


//Update a request status
export const UpdateRequestStatus = async (request) => {
    try {
        const {data} = await axiosInstance.post("/api/requests/update-request-status", request);
        return data;
    } catch (error) {
        return error.response.data;
    }
}