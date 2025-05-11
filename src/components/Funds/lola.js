import React from 'react';
import {
    FlaskConical,
    Users,
    DollarSign,
    CalendarDays,
    Clock3,
    // Tag,
  } from "lucide-react";
  import lola from '../../assets/lola.png';

export const Lola = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="max-w-5xl mx-auto px-4 py-24">
                <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">

                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <img src={lola} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Fund III: LoLa Capital</h3>
                                <p className="text-sm text-gray-500">LoLaCap Partners</p>
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md text-sm font-medium">
                            Open
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                            <FlaskConical className="h-4 w-4 mt-0.5 text-gray-500" />
                            <span>Focused on life sciences, therapeutics, and medical devices</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <Users className="h-4 w-4 mt-0.5 text-gray-500" />
                            <span>
                                <strong>Fund Managers:</strong>{' '}
                                <a href="https://www.linkedin.com/in/greg-verdine-b181991/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Greg Verdine</a>,{' '}
                                <a href="https://www.linkedin.com/in/circe-lyu-190901a1/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Circe Lyu</a>,{' '}
                                <a href="https://www.linkedin.com/in/sashank-reddy-1b4710bb/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Sashank Reddy</a>
                            </span>
                        </div>
                        <div className="flex items-start gap-2">
                            <DollarSign className="h-4 w-4 mt-0.5 text-gray-500" />
                            <span>Fund Size: $200MM | $5MM allocated to LimitLess</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CalendarDays className="h-4 w-4 mt-0.5 text-gray-500" />
                            <span>Target close: June 30, 2025</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <Clock3 className="h-4 w-4 mt-0.5 text-gray-500" />
                            <span>Timeline: 10–12 years before fund exit</span>
                        </div>
                    </div>


                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {["Life Sciences", "Therapeutics", "Medical Devices"].map((tag) => (
                            <span
                                key={tag}
                                className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-full font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Investment Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 text-sm pt-2">
                        <div>
                            <p className="text-gray-500">Total Fund Size</p>
                            <p className="font-medium text-gray-900">$200MM</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Minimum Investment</p>
                            <p className="font-medium text-gray-900">$50K</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Fee Structure</p>
                            <p className="font-medium text-gray-900">3.5% Management Fee, 20% Carried Interest</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Investor Requirement</p>
                            <p className="font-medium text-gray-900">
                                Qualified purchasers only (5M in assets).{' '}
                                <a
                                    href="https://www.sec.gov/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Learn more
                                </a>
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Capital Call</p>
                            <p className="font-medium text-gray-900">Schedule TBD</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Targeted Timeline</p>
                            <p className="font-medium text-gray-900">10–12 years before fund exit</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                        *2.5/20 structure paid to fund manager, plus a 1% management fee to LimitLess to support platform, service, security, and operations.
                    </footer>
                </div>
            </div>
        </div>
    );
};
