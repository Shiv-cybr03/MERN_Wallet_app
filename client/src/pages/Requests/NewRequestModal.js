import React from 'react';
import { Modal , Form, message} from 'antd';
import { useSelector } from 'react-redux';
// import { useDispatch } from "react-redux"
import { VerifyAccount } from "../../apicalls/transactions";
import {SendRequests} from '../../apicalls/requests';


function NewRequestModal({
    showNewRequestModal,
    setShowNewRequestModal,
    //reloadData,
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
    //Amount validata 
    const validateAmount = (_, value) => {
        const enteredAmount = parseFloat(value);
    
        if (!isNaN(enteredAmount)) {
            return Promise.resolve();
        }
        return Promise.reject('Invalid Amount');
    };

    const onFinish = async (values) => {
        try {
            //dispatch(ShowLoading());
            const payload = {
                ...values,  
                sender: user,
                receiver: user,
                status: "success",
                description: values.description || "no description",
            }
            console.log("Payload details : ",payload);
            const response = await SendRequests(payload);
            console.log("After send the payload response : ",response);
            if(response.success){
                //reloadData();
                setShowNewRequestModal(false);
                message.success(response.message);
            }else{
                message.error(response.message);
            }
            //dispatch(HideLoading());
        } catch (error) {
            console.error("Form submission error:", error)
            message.error(error.message);
            //dispatch(HideLoading());
        }
    }
    
    return (
        <div>
            <Modal 
                title="Transfer requested"
                open={showNewRequestModal}  // Corrected prop name
                onCancel={() => setShowNewRequestModal(false)}
                onClose={() => setShowNewRequestModal(false)}
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
                        <input type="number" name='amount'/>
                    </Form.Item>

                    <Form.Item label="description" name="description">
                        <textarea type='text'/>
                    </Form.Item>
                    <div className='flex justify-end gap-1'>
                        <button className='primary-outlined-btn'>Cancel</button>
                        {isVerified==='true' && <button className='primary-contained-btn'>Request</button>}
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default NewRequestModal;