import React, { useEffect } from 'react';
import { GetAllUsers, UpdateUserVerifiedStatus } from '../../apicalls/users';
// import { useDispatch } from 'react-redux';
import { Table, message } from "antd";
import PageTitle from "../../components/PageTitle";

function Users(){
    const [users, setUsers] = React.useState([])
    //const dispatch = useDispatch()

    const getData = async () => {
        try {
            // dispatch(showLoading());
            const response = await GetAllUsers()
            //dispatch(HideLoading())
            if(response.success){
                setUsers(response.data)
            }else{
                message.error(response.message)
            }
        } catch (error) {
            //dispatch(HideLoading())
            message.error(error.message)
        }
    }

    const updateStatus = async (record, isVerified) => {
        try {
            //dispatch(showLoading());
            const response = await UpdateUserVerifiedStatus({
                selectedUser: record._id,
                isVerified,
            });
            //dispatch(HideLoading())
            if(response.success) {
                message.success(response.message);
                getData();
            }else{
                message.error(response.message);
            }
        } catch (error) {
            //dispatch(HideLoading());
            message.error(error.message);
        }
    }

    const columns = [
        {
            title: "First Name",
            dataIndex: "firstName"
        },
        {
            title: "Last Name",
            dataIndex: "lastName"
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber"
        },
        {
            title: "verified",
            dataIndex: "isVerified",
        },
        {
            title: "Action",
            dataIndex: "action",
            render : (text,record) => {
                return <div className='flex gap-1'>
                    {record.isVerified === "true" ? (
                        <button className='btn btn-danger'
                        onClick={()=> updateStatus(record, false)}
                        >Suspend</button>
                    ) : (
                        <button className='btn btn-success'
                        onClick={()=> updateStatus(record, true)}
                        >Active</button>
                    )}
                </div>
            }
        }
    ]


    useEffect(() => {
        getData()
    },[])
    return(
        <div>
            <PageTitle title= "Users" />
            <Table dataSource={users} columns={columns} className='mt-2'/>
        </div>
    )
}

export default Users;