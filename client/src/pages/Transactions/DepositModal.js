import React from 'react';
import { Modal, Form, message } from 'antd';
import StripeCheckout from "react-stripe-checkout";
import { DepositFunds } from '../../apicalls/transactions';
// import { useDispatch } from 'react-redux';

function DepositModal({showDepositModal,setShowDepositModal,reloadData}){
    const [form] = Form.useForm();
    // const dispatch = useDispatch();

    const onToken = async(token) => {
        try {
            // dispatch(HideLoading());
            const response = await DepositFunds({token, amount: form.getFieldValue("amount")});
            // dispatch(HideLoading());
            if(response.success){
                reloadData();
                setShowDepositModal(false);
                message.success(response.message);
            }else{
                message.error(response.message);
            }
        } catch (error) {
            // dispatch(HideLoading());
            message.error(error.message);
        }
    }
    console.log("Form Data from getfieldsvalue :", form.getFieldsValue());

    console.log("Form data from Form : ", Form);
    return (
        <Modal
        title="Deposit" open={showDepositModal}
        onCancel={() => setShowDepositModal(false)}
        footer={null}>
            <div className="flex-col gap-1">
                <Form layout='vertical' form={form}> 

                <Form.Item label="Amount" name="amount"
                    rules={[
                        {
                            required: true,
                            message: "Please input amount"
                        },
                    ]}>
                    <input type="number"/>
                </Form.Item>

                <div className='flex justify-end gap-1'>
                    <button className='primary-outline-btn' onClick={() => setShowDepositModal(false)}>Cancel</button>  
                    
                    <StripeCheckout
                        token={onToken}
                        currency='INR'
                        amount={form.getFieldValue('amount') * 100}
                        shippingAddress
                        stripeKey="pk_test_51Os2a1SCyEj5plrEhy8nlfMvcyuN2wmqOsbIC5P05OyPo4RDDDxAuAeHXHfhUPgI2E9iAiMbdpDKMCfyHo39VOCp001Dwzy6WV" url="http://localhost:3000/transactions">
                        <button className='primary-contained-btn'>Deposit</button>
                    </StripeCheckout>
                </div>
                </Form>
            </div>
        </Modal>
    )
}

export default DepositModal;
