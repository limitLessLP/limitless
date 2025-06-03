import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx";
import { Badge } from "../../ui/badge.tsx";
import { Navbar } from "./navbar.js";
import { Footer } from "../Common/Footer.js";
import { SectionHeader } from "../../ui/sectionHeader.tsx";
import { SkeletonWrapper } from "../Common/skeleton";
import { Button } from "../../ui/button.tsx";

const Portfolio = () => {
    const [portfolioCompanies, setPortfolioCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const fund = localStorage.getItem("fund");

    const getPortfolioCompanies = async () => {
        try {
            const response = await fetch('https://limitless-backend.vercel.app/api/get-fund-portcos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: fund }),
            });
            const data = await response.json();
            if (data) {
                setPortfolioCompanies(data.portCos);
            } else {
                console.error('Failed to fetch portfolio companies:', data.message);
                setPortfolioCompanies([]);
            }
        } catch (error) {
            console.error('Error fetching portfolio companies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPortfolioCompanies();
    }, []);

    const handleSendMessage = (companyName) => {
        alert(`Send message to ${companyName}`);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto py-24 min-h-[calc(100vh-4rem)]">
                <SectionHeader className="py-6" title="Portfolio Companies" description="Companies currently backed by your firm" />

                <Card>
                    <CardHeader>
                        <CardTitle>Companies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SkeletonWrapper loading={loading} rows={3} height="h-32" />

                        {!loading && ((portfolioCompanies && 
                            portfolioCompanies.length > 0) ? (portfolioCompanies || []).map((company, index) => (
                                <Card key={index} className="premium-card py-6">
                                    <CardContent className="flex flex-col sm:flex-row sm:items-center p-4">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <h3 className="font-medium">{company.name}</h3>
                                            </div>
                                            <p className="mt-1 text-sm">{company.description}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {company.category.map((cat, idx) => (
                                                    <Badge key={idx} variant="outline">{cat}</Badge>
                                                ))}
                                            </div>
                                            <div className="mt-2 text-sm space-y-1">
                                                <p>
                                                    <strong>Website:</strong>{" "}
                                                    <a
                                                        href={`https://${company.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {company.website}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-start sm:items-end">
                                            <Button
                                                onClick={() => handleSendMessage(company.name)}
                                            >
                                                Send Message
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <CardContent className="space-y-4 pt-6 h-32">
                                    <p className="text-center text-gray-500">No portfolio companies found.</p>
                                </CardContent>
                            ))}
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </>
    );
};

export default Portfolio;
