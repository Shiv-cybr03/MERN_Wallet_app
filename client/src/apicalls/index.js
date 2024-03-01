// Making HTTP requesting 
import axios from 'axios';

// Create an instance of Axios with custom configuration
export const axiosInstance = axios.create({
    // Custom headers configuration
    headers : {
        'authorization' : `Bearer ${localStorage.getItem('token')}`
    }
});