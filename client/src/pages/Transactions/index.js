
import React, { useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { Table, message } from "antd";
import TranserFundsModal from "./TranserFundsModal";  // Update the path accordingly
//import { useDispatch } from "react-redux";
import { GetTransactionsOfUser } from "../../apicalls/transactions";
import moment from "moment";
import { useSelector } from "react-redux";
import DepositModal from "./DepositModal";

function Transactions() {
    const [showTransferFundsModal, setShowTransferFundsModal] = React.useState(false);
    const [showDepositModal, setShowDepositModal] = React.useState(false);
    const [data = [], setData] = React.useState([]);
    const {user} = useSelector(state => state.users) || {};
    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (text, record) => {
                return moment(record.createAt).format("DD-MM-YYYY hh:mm:ss A")
            }
        },
        {
            title: "Transaction ID",
            dataIndex: "_id",
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (text,record) => {
                if(record.sender._id === record.receiver._id){
                    return "Deposit"
                }else if(record.sender._id === user._id){
                    return "Debit";
                }else{
                    return "Credit";
                }
            }
        },
        {
            title: "Reference Account",
            dataIndex: "",
            render: (text, record) => {
                return record.sender === user._id ? (
                    <div>
                        <h1 className="text-sm">
                            {record.receiver.firstName} {record.receiver.lastName}
                        </h1>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-sm">
                            {record.sender.firstName} {record.sender.lastName}
                        </h1>
                    </div>
                );
            },
        },
        
        {
            title: "Reference",
            dataIndex: "reference",
            render: (text, record) => {
                // Check if sender property is present and has a description
                const senderDescription = record?.reference || "N/A";
        
                return (
                    <div>
                        <h1 className="text-sm">{senderDescription}</h1>
                    </div>
                );
            },
        },  
        {
            title: "Status",
            dataIndex: "status",
        },
    ];
    //const dispatch = useDispatch();

    const getData = async() => {
        try {
           //dispatch(ShowLoading());
           const response = await GetTransactionsOfUser();
           if(response.success){
            setData(response.data)
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

    return (
        <div>
            <div className="flex justify-between">
                <PageTitle title="Transactions" />
                <div className="flex gap-1 items-center">
                    <button className="primary-outlined-btn"
                     onClick={() => setShowDepositModal(true)}
                    >Deposit</button>
                    <button
                        className="primary-contained-btn bg-color"
                        onClick={() => setShowTransferFundsModal(true)}
                    >
                        Transfer
                    </button>
                </div>
            </div>

            <Table columns={columns} dataSource={data} className="mt-2" rowKey="_id" />

            {showTransferFundsModal && (
                <TranserFundsModal
                    showTransferFundsModal={showTransferFundsModal}
                    setShowTransferFundsModal={setShowTransferFundsModal}
                    reloadData={getData}
                />
            )}
            {showDepositModal && (
              <DepositModal
                showDepositModal={showDepositModal}
                setShowDepositModal={setShowDepositModal}
                reloadData={getData}/>
            )}
        </div>
    );
}

export default Transactions;