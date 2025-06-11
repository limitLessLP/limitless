import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/card.tsx';
import { Badge } from '../../ui/badge.tsx';
import { Button } from '../../ui/button.tsx';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from './navbar.js';
import { Footer } from '../Common/Footer.js';

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

export default function GpProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('gp_uuid');
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

        const response = await fetch(`https://limitless-backend.vercel.app/api/gp-user-info?id=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data');
        }

        if (!data.success || !data.user) {
          throw new Error('Invalid response format');
        }

        setUserData(data.user);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const content = () => {
    if (error) {
      return (
        <Card className="p-6">
          <div className="text-red-600">Error: {error}</div>
        </Card>
      );
    }

    if (isLoading) {
      return (
        <Card className="p-6">
          <SkeletonLoader />
        </Card>
      );
    }

    return (
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">
                {userData.firstName} {userData.lastName}
              </h2>
              {userData.verified && (
                <Badge variant="success" className="ml-2">
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="text-gray-600 mb-4">
              <p className="font-medium">{userData.position}</p>
              <p>{userData.firm}</p>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-2">
                <span className="font-medium w-20">Email:</span>
                <span className="text-gray-700">{userData.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium w-20">Phone:</span>
                <span className="text-gray-700">{userData.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium w-20">Company:</span>
                <span className="text-gray-700">{userData.firm}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar currentPage="profile" />
      
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/gp-dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
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
}