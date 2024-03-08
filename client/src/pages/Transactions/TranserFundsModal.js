import React from 'react';
import { Modal , Form, message} from 'antd';
import { useSelector } from 'react-redux';
// import { useDispatch } from "react-redux"
import { VerifyAccount, TransferFunds } from "../../apicalls/transactions"

function TranserFundsModal({
    showTransferFundsModal,  // Corrected prop name
    setShowTransferFundsModal,
    reloadData,
    //set loader Data 
}) {    
    const {user} = useSelector(state => state.users)
    const [isVerified, setIsVerified] = React.useState('');
    const [form] = Form.useForm();
    //const dispatch = useDispatch();

    //Account verifiy logic 
    const verifyAccount = async () => {
        try {
            //dispatch(Showloading());
            const response = await VerifyAccount({
                receiver: form.getFieldValue("receiver")
            });
            //dispatch(HideLoading());
            if(response.success){
                setIsVerified('true');
            }else{
                setIsVerified('false');
            }
        } catch (error) {
            //dispatch(HideLoading());
            setIsVerified('false');
        }
    }

    const validateAmount = (_, value) => {
        const enteredAmount = parseFloat(value);
        const userBalance = parseFloat(user.balance);
    
        if (!isNaN(enteredAmount) && enteredAmount <= userBalance) {
          return Promise.resolve();
        }
        return Promise.reject('Insufficient Balance');
      };

    const onFinish = async (values) => {
        try {
            //dispatch(ShowLoading());
            const payload = {
                ...values,  
                sender: user._id,
                status: "success",
                reference: values.reference || "no reference",
            }
            const response = await TransferFunds(payload);
            if(response.success){
                reloadData();
                setShowTransferFundsModal(false);
                message.success(response.message);
            }else{
                message.error(response.message);
            }
            //dispatch(HideLoading());
        } catch (error) {
            message.error(error.message);
            //dispatch(HideLoading());
        }
    }
    
    return (
        <div>
            <Modal 
                title="Transfer funds"
                open={showTransferFundsModal}  // Corrected prop name
                onCancel={() => setShowTransferFundsModal(false)}
                onClose={() => setShowTransferFundsModal(false)}
                footer={null}
            >
                {/* Add your modal content here */}
                <Form layout='vertical' form={form} onFinish={onFinish}>
                    <div className='flex gap-2 items-center'>
                    <Form.Item label="Account Number" name="receiver" className='w-100'>
                        <input type='text'/>
                    </Form.Item>
                    <button className='primary-contained-btn mt-1' type='button' onClick={verifyAccount}>
                        VERIFY
                    </button>
                    </div>
                    {isVerified==='true' && (
                        <div className='success-bg'>Account verified successfully</div>
                    )}
                    {isVerified==='false' && (
                        <div className='error-bg'>Invaild Account!</div>
                    )}

                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your amount',
                            },
                            {
                                validator: validateAmount,
                            },]}>
                        <input type="number" max={user.balance} />
                    </Form.Item>

                    <Form.Item label="Reference" name="reference">
                        <textarea type='text'/>
                    </Form.Item>
                    <div className='flex justify-end gap-1'>
                        <button className='primary-outlined-btn'>Cancel</button>
                        {isVerified==='true' && <button className='primary-contained-btn'>Transfer</button>}
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default TranserFundsModal;