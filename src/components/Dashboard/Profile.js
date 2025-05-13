import { useEffect, useState } from 'react';
import { DashboardNav } from "./DashboardNav"
import { useNavigate } from 'react-router-dom';
import { Button } from '../Common/button';

const Profile = () => {
    // const userId = localStorage.getItem('userId') || "6822617a6022fe11479d965d";
    const userId = "6822617a6022fe11479d965d";
    const [user, setUser] = useState({});

    useEffect(() => {
        if (userId) {
            // Fetch user data from an API or other source
            fetch(`https://limitless-backend.vercel.app/api/user-info?id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setUser(data.user);
                    } else {
                        console.error('Failed to fetch user data');
                    }
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [userId]);

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNav />
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.firstName}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.lastName}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Verification Pending</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.verification_pending ? 'Yes' : 'No'}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Verified</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.verified ? 'Yes' : 'No'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white transition-all duration-300 shadow-md hover:shadow-lg my-4"
                >
                    Return to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default Profile;