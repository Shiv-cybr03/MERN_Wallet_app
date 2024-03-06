import React from 'react';
import { Modal , Form} from 'antd';
import { useSelector } from 'react-redux';
// import { useDispatch } from "react-redux"
import { VerifyAccount } from "../../apicalls/transactions"

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
    
    return (
        <div>
            <Modal 
                title="Transfer funds"
                visible={showTransferFundsModal}  // Corrected prop name
                onCancel={() => setShowTransferFundsModal(false)}
                onClose={() => setShowTransferFundsModal(false)}
                footer={null}
            >
                {/* Add your modal content here */}
                <Form layout='vertical' form={form}>
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

                    <Form.Item label="Amount " name="amount" rules={[
                        {
                            required: true,
                            message: "Please input Your amount",
                        },
                        {
                            max: user.balance,
                            message: "Insufficient Balance",
                        }
                    ]}>
                        <input type='text'/>
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <textarea type='text'/>
                    </Form.Item>
                    <div className='flex justify-end gap-1'>
                        <button className='primary-outlined-btn'>Cancel</button>
                        {form.getFieldValue("amount") > user.balance && isVerified && <button className='primary-contained-btn'>Transfer</button>}
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default TranserFundsModal;
