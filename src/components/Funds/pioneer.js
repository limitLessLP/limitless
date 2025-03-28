import React from 'react';
import pioneerLogo from '../../assets/pioneer.png';

export const PioneerVC = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="max-w-5xl mx-auto px-4 py-24">
                <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <img src={pioneerLogo} alt="Logo" className="w-18 h-16 rounded-full" />
                            <div>
                                <h3 className="text-2xl font-semibold">Pioneer VC Fund I</h3>
                                <p className="text-sm text-gray-500">Pioneer VC Partners</p>
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-lg">
                            Open
                        </div>
                    </div>
                    <div className="text-sm text-black space-y-4">
                        <p>
                            Pioneer VC is a bio and health-focused investment fund managed by experienced professionals, including Dave Messina, General Partner. The fund targets investments in therapeutics and healthcare companies.
                        </p>
                        <p>
                            The total fund size is $50MM, with $1MM allocated to LimitLess. The fund is set to close by mid-June 2025.
                        </p>
                        <p>
                            Pioneer VC aims to provide significant returns to investors over a targeted timeline of 5-10 years before fund exit.
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Bio & Health</span>
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Therapeutics</span>
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Healthcare</span>
                    </div>

                    {/* Investment Info and CTA */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 space-y-4 md:space-y-0">
                        <div className="pr-4">
                            <p className="text-sm text-gray-500">Total Fund Size</p>
                            <p className="font-medium">$50MM</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Minimum Investment</p>
                            <p className="font-medium">$25K</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Fee Structure</p>
                            <p className="font-medium">3% Management Fee, 20% Carried Interest</p>
                        </div>
                        <button className="bg-green-950 text-white px-4 py-2 rounded hover:bg-blue-600 transition ml-auto">
                            View Details →
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-6 space-y-4">
                        <p className="text-sm text-gray-500">
                            <strong>Investor Requirement:</strong> Qualified purchasers only (5M in assets).{' '}
                            <a
                                href="https://www.sec.gov"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Learn more
                            </a>
                        </p>
                        <p className="text-sm text-gray-500">
                            <strong>Capital Call:</strong> Schedule TBD
                        </p>
                        <p className="text-sm text-gray-500">
                            <strong>Targeted Timeline:</strong> 5-10 years before fund exit
                        </p>
                    </div>
                    <footer className="text-sm text-gray-500">
                        *2/20 structure paid to fund manager (standard across industry), plus a 1% management fee to LimitLess to support platform, service, security, and operations.
                    </footer>
                </div>
            </div>
        </div>
    );
};