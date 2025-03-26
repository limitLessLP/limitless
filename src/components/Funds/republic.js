import React from 'react';
import republic from '../../assets/republic.png';

export const RepublicVC = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="max-w-5xl mx-auto px-4 py-24">
                <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <img src={republic} alt="Logo" className="w-18 h-16 rounded-full" />
                            <div>
                                <h3 className="text-2xl font-semibold">Fund II: Republic VC</h3>
                                <p className="text-sm text-gray-500">Republic Ventures</p>
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-lg">
                            Open
                        </div>
                    </div>
                    <div className="text-sm text-black space-y-4">
                        <p>
                            Republic VC is an investment fund focused on AI, fintech, and consumer sectors. The fund is managed by experienced professionals.
                        </p>
                        <p>
                            <strong>Fund Manager(s):</strong> 
                            <a href="https://www.linkedin.com/in/sophie007/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Sophie Liao</a>, General Partner.
                        </p>
                        <p>
                            The total fund size is approximately $50MM, with $1MM allocated to LimitLess. The fund closing date is yet to be determined.
                        </p>
                        <p>
                            Republic VC aims to provide significant returns to investors over a targeted timeline of 5-10 years before fund exit.
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">AI</span>
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Fintech</span>
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Consumers</span>
                    </div>

                    {/* Investment Info and CTA */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 space-y-4 md:space-y-0">
                        <div className="pr-4">
                            <p className="text-sm text-gray-500">Total Fund Size</p>
                            <p className="font-medium">~$50MM</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Minimum Investment</p>
                            <p className="font-medium">$25K</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Fee Structure</p>
                            <p className="font-medium">3% Management Fee, 20% Carried Interest</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Investor Requirement</p>
                            <p className="font-medium">
                                Qualified purchasers only (5M in assets).{' '}
                                <a href="https://www.sec.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    Learn more
                                </a>
                            </p>
                        </div>
                        <button className="bg-green-950 text-white px-4 py-2 rounded hover:bg-blue-600 transition ml-auto">
                            View Details →
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-6 space-y-4">
                        <p className="text-sm text-gray-500">
                            <strong>Capital Call:</strong> Schedule TBD
                        </p>
                        <p className="text-sm text-gray-500">
                            <strong>Targeted Timeline:</strong> 5-10 years before fund exit
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};