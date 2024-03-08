import React from "react";
import { useSelector } from 'react-redux';
import PageTitle from '../../components/PageTitle';

function Home() {
    const { user } = useSelector(state => state.users);
    //const dispatch = useDispatch();

    // Example: Change title based on user type
    //const userType = user.isAdmin ? 'Administrator' : 'User';
    const greeting = `Hello ${user.firstName} ${user.lastName}, Welcome to the Home Page`;
    return (
        <div>
            <PageTitle title={`${greeting}`} />
            <div className="bg-secondary p-2 mt-3 w-50 br-3 flex flex-col gap-1">
                <div className="flex justify-between">
                    <h1 className="text-md text-white">Account Number</h1>
                    <h1 className="text-md text-white">{user._id}</h1>
                </div>
                <div className="flex justify-between">
                    <h1 className="text-md text-white">Balance</h1>
                    <h1 className="text-md text-white">INR {user.balance || 0}</h1>
                </div>
            </div>

            <div className="card p-2 mt-4 w-50 br-3 flex flex-col gap-1">
                <div className="flex justify-between">
                    <h1 className="text-md text-white">First Name</h1>
                    <h1 className="text-md text-white">{user.firstName}</h1>
                </div>
                <div className="flex justify-between">
                    <h1 className="text-md text-white">last Name</h1>
                    <h1 className="text-md text-white">{user.lastName}</h1>
                </div>
                <div className="flex justify-between">
                    <h1 className="text-md text-white">Email</h1>
                    <h1 className="text-md text-white">{user.email}</h1>
                </div>
                <div className="flex justify-between">
                    <h1 className="text-md text-white">Mobile no:-</h1>
                    <h1 className="text-md text-white">{user.phoneNumber}</h1>
                </div>
                <div className="flex justify-between">
                    <h1 className="text-md text-white">Identifycation Type</h1>
                    <h1 className="text-md text-white">{user.identificationType}</h1>
                </div>
                <div className="flex justify-between">
                    <h1 className="text-md text-white">Identifycation Number </h1>
                    <h1 className="text-md text-white">{user.identificationNumber}</h1>
                </div>
            </div>
        </div>
    );
}

export default Home;
