
import React from "react";
import PageTitle from "../../components/PageTitle";
import { Table } from "antd";
import TranserFundsModal from "./TranserFundsModal";  // Update the path accordingly

function Transactions() {
    const [showTransferFundsModal, setShowTransferFundsModal] = React.useState(false);

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
        },
        {
            title: "Transaction ID",
            dataIndex: "transactionId",
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Type",
            dataIndex: "type",
        },
        {
            title: "Reference",
            dataIndex: "reference",
        },
        {
            title: "Status",
            dataIndex: "status",
        },
    ];

    return (
        <div>
            <div className="flex justify-between">
                <PageTitle title="Transactions" />
                <div className="flex gap-1 items-center">
                    <button className="primary-outlined-btn">Deposit</button>
                    <button
                        className="primary-contained-btn bg-color"
                        onClick={() => setShowTransferFundsModal(true)}
                    >
                        Transfer
                    </button>
                </div>
            </div>

            <Table columns={columns} dataSource={[]} className="mt-2" />

            {showTransferFundsModal && (
                <TranserFundsModal
                    showTransferFundsModal={showTransferFundsModal}
                    setShowTransferFundsModal={setShowTransferFundsModal}
                />
            )}
        </div>
    );
}

export default Transactions;
