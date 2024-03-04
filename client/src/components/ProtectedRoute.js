import React from "react";
import { message } from "antd";
import { useEffect} from "react";
import { GetUserInfo } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { setUser } from "../redux/usersSlice";

function ProtectedRoute(props){
    const {user} = useSelector(state=>state.users)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getData = async () => {
        try {
            const response = await GetUserInfo();
            console.log(response);
            if(response.success){
                dispatch(setUser(response.data))
            }else{
                message.error(response.data);
                navigate("/login");
            }
        } catch (error) {
            navigate("/login");
            message.error(error.message)
        }
    }

    useEffect(() => {
        // if you have  present token the localstorage to getData 
        if(localStorage.getItem("token")){
            if(!user){
                getData();
            }
        }else{
            //else to redirect the login page. 
            navigate("/login");
        }
    },[]);

    return (
        user && <div>{props.children}</div>
    )
}

export default ProtectedRoute;