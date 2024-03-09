import React, { useEffect } from 'react';
import {Tabs, message, Table} from 'antd';
import moment from 'moment';
import PageTitle from '../../components/PageTitle';
import NewRequestModal from './NewRequestModal';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllRequestsByUser } from '../../apicalls/requests';
const {TabPane} = Tabs;


function Requests(){
    const [data, setData] = React.useState([]);
    const [showNewRequestModal, setShowNewRquestModal] = React.useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users)

    const  columns = [
        {
            title: "Requests ID",
            dataIndex: "id"
        },
        {
            title: "Sender",
            dataIndex: "sender",
            render (sender){
                return sender.email + " " + sender.lastName;
            },
        },
        {
            title: "Receiver",
            dataIndex: "receiver",
            render (receiver) {
                return receiver.firstName + " " + receiver.lastName;
            },
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Date",
            dataIndex: "date",
            render (text, record) {
                return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A")
            },
        },
        {
            title: "Status",
            dataIndex: "status"
        },
    ];

    const getData = async() => {
        try {
           //dispatch(ShowLoading());
           const response = await GetAllRequestsByUser();
           console.log("response : ",response);
           if(response.success){
            const sendData = response.data.filter((item)=>item.sender._id===user._id);
            const receiverData = response.data.filter((item)=>item.receiver._id===user._id)

            setData({
                sent: sendData,
                received: receiverData
            })
           }
           //dispatch(HideLoading());
        } catch (error) {
            //dispatch(HideLoading());
            message.error(error.message);
        }
    };

    useEffect(()=>{
        getData();
    },[]);

    return <div> 
        <div className='flex justify-between'>
            <PageTitle title="Requests"/>
            <button className='primary-outline-btn'
            onClick={() => setShowNewRquestModal(true)}>
                Requests Funds
            </button>
        </div>

        <Tabs defaultActiveKey='1'>
            <TabPane tab="Sent" key="1">
                <Table columns={columns} dataSource={data.sent}/>
            </TabPane>
            <TabPane tab="Received" key="2">
                <Table columns={columns} dataSource={data.received}/>    
            </TabPane>
        </Tabs>

        {showNewRequestModal && ( 
            <NewRequestModal 
            showNewRequestModal={showNewRequestModal}
            setShowNewRequestModal={setShowNewRquestModal}/>)}
    </div>
}

export default Requests;
