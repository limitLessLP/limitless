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

    useEffect(() => {
        // Simulate an API call
        setTimeout(() => {
            const fetchedData = [
                {
                    name: 'Tech Innovators Inc.',
                    contact: 'John Doe',
                    industry: 'Technology',
                    linkedin: 'https://linkedin.com/company/tech-innovators',
                    description: 'A leading company in AI and machine learning solutions.',
                },
                {
                    name: 'Green Future Ltd.',
                    contact: 'Jane Smith',
                    industry: 'Renewable Energy',
                    linkedin: 'https://linkedin.com/company/green-future',
                    description: 'Focused on sustainable energy solutions for a better tomorrow.',
                },
                {
                    name: 'HealthFirst Corp.',
                    contact: 'Emily Johnson',
                    industry: 'Healthcare',
                    linkedin: 'https://linkedin.com/company/healthfirst',
                    description: 'Innovating healthcare with cutting-edge technology.',
                },
            ];
            setPortfolioCompanies(fetchedData);
            setLoading(false);
        }, 1000); // Simulate a 2-second delay
    }, []);

    const handleSendMessage = (companyName) => {
        alert(`Send message to ${companyName}`);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto py-24">
            <SectionHeader className="py-6" title="Portfolio Companies" description="Companies currently backed by your firm" />

            <Card>
                <CardHeader>
                <CardTitle>Companies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <SkeletonWrapper loading={loading} rows={3} height="h-32" />

                {!loading &&
                    portfolioCompanies.map((company, index) => (
                    <Card key={index} className="premium-card py-6">
                        <CardContent className="flex flex-col sm:flex-row sm:items-center p-4">
                        <div className="flex-1">
                            <div className="flex items-center">
                            <h3 className="font-medium">{company.name}</h3>
                            <Badge className="ml-2">{company.industry}</Badge>
                            </div>
                            <p className="mt-1 text-sm">{company.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">{company.industry}</Badge>
                            </div>
                            <div className="mt-2 text-sm space-y-1">
                            <p>
                                <strong>Contact:</strong> {company.contact}
                            </p>
                            <p>
                                <strong>LinkedIn:</strong>{" "}
                                <a
                                href={company.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                                >
                                {company.linkedin}
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
                    ))}
                </CardContent>
            </Card>
            </div>
            <Footer />
        </>
    );
};

export default Portfolio;