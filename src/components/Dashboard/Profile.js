import { useEffect, useState } from 'react';
import { DashboardNav } from "./DashboardNav"
import { useNavigate } from 'react-router-dom';
import { Button } from '../Common/button';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../Common/Footer';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

const Profile = () => {
    const userId = localStorage.getItem('userId');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) {
                    throw new Error('User ID not found in localStorage');
                }

                const response = await fetch(`https://limitless-backend.vercel.app/api/user-info?id=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch user data');
                }

                if (data.success) {
                    setUser(data.user);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const content = () => {
        if (error) {
            return (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-red-600">Error: {error}</div>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="bg-white shadow rounded-lg p-6">
                    <SkeletonLoader />
                </div>
            );
        }

        return (
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                    <div className="w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-2xl font-bold">
                                {user.firstName} {user.lastName}
                            </h2>
                            {user.verified && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Verified
                                </span>
                            )}
                            {user.verification_pending && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Verification Pending
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 mt-6">
                            <div className="flex items-center gap-2">
                                <span className="font-medium w-20">Email:</span>
                                <span className="text-gray-700">{user.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-medium w-20">Phone:</span>
                                <span className="text-gray-700">{user.phone || 'Not provided'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-medium w-20">Type:</span>
                                <span className="text-gray-700">{user.type || 'Limited Partner'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardNav currentPage="profile" />
            
            <div className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        onClick={() => navigate('/dashboard')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="mt-2 text-gray-600">View and manage your profile information</p>
                </div>
                
                {content()}
            </div>
            
            <Footer />
        </div>
    );
};

export default Profile;