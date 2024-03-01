import React from "react";
import { message } from "antd";
import { useEffect} from "react";
import { GetUserInfo } from "../apicalls/users";
import { useNavigate } from "react-router-dom";

function ProtectedRoute(props){

    const [userDate , setUserData] = React.useState(null);
    const navigate = useNavigate();
    const getData = async () => {
        try {
            const response = await GetUserInfo();
            console.log(response);
            if(response.success){
                setUserData(response.data);
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
            if(!userDate){
                getData();
            }
        }else{
            //else to redirect the login page. 
            navigate("/login");
        }
    },[]);

    return (
        <div>{props.children}</div>
    )
}

export default ProtectedRoute;