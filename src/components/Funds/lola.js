import React from 'react';
import lola from '../../assets/lola.png';

export const Lola = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="max-w-5xl mx-auto px-4 py-24">
                <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <img src={lola} alt="Logo" className="w-18 h-16 rounded-full" />
                            <div>
                                <h3 className="text-2xl font-semibold">Fund III: LoLa Capital</h3>
                                <p className="text-sm text-gray-500">LoLaCap Partners</p>
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-lg">
                            Open
                        </div>
                    </div>
                    <div className="text-sm text-black space-y-4">
                        <p>
                            LoLa Capital is a life sciences-focused investment fund managed by experienced professionals. The fund targets investments in therapeutics and medical devices.
                        </p>
                        <p>
                            <strong>Fund Manager(s): </strong> 
                            <a href="https://www.linkedin.com/in/greg-verdine-b181991/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Greg Verdine</a>, Founding General Manager (GP), 
                            {' '}<a href="https://www.linkedin.com/in/circe-lyu-190901a1/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Circe Lyu</a>, Founding General Manager, and
                            {' '}<a href="https://www.linkedin.com/in/sashank-reddy-1b4710bb/"  target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Sashank Reddy</a>, Venture Partner.
                        </p>
                        <p>
                            The total fund size is $200MM, with $5MM allocated to LimitLess. The fund is set to close by June 30, 2025.
                        </p>
                        <p>
                            LoLa Capital aims to provide significant returns to investors over a targeted timeline of 10-12 years before fund exit.
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Life Sciences</span>
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Therapeutics</span>
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Medical Devices</span>
                    </div>

                    {/* Investment Info and CTA */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 space-y-4 md:space-y-0">
                        <div className="pr-4">
                            <p className="text-sm text-gray-500">Total Fund Size</p>
                            <p className="text-sm">$200MM</p>
                        </div>
                        <div className="pr-4">
                            <p className="text-sm text-gray-500">Minimum Investment</p>
                            <p className="text-sm">$50K</p>
                        </div>
                        <div className="pr-4">
                            <p className="text-sm text-gray-500">Fee Structure</p>
                            <p className="text-sm">3.5% Management Fee, 20% Carried Interest</p>
                        </div>
                        <div className="pr-4">
                            <p className="text-sm text-gray-500">Investor Requirement</p>
                            <p className="text-sm">
                                Qualified purchasers only (5M in assets).{' '}
                                <a href="https://www.sec.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    Learn more
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-6 space-y-4">
                        <p className="text-sm text-gray-500">
                            <strong>Capital Call:</strong> Schedule TBD
                        </p>
                        <p className="text-sm text-gray-500">
                            <strong>Targeted Timeline:</strong> 10-12 years before fund exit
                        </p>
                    </div>

                    <footer className="text-sm text-gray-500">
                        *2.5/20 structure paid to fund manager, plus a 1% management fee to LimitLess to support platform, service, security, and operations.
                    </footer>
                </div>
            </div>
        </div>
    );
};