import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx";
import { Badge } from "../../ui/badge.tsx";
import { Navbar } from "./navbar.js";
import { Footer } from "../Common/Footer.js";
import { SectionHeader } from "../../ui/sectionHeader.tsx";
import { SkeletonWrapper } from "../Common/skeleton";
import { Button } from "../../ui/button.tsx";
import { GPCopilotWidget } from "./GPCopilotWidget.js";
import { Plus } from "lucide-react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Textarea } from "../../ui/textarea.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../ui/dialog.jsx";

const Portfolio = () => {
    const [portfolioCompanies, setPortfolioCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddingCompany, setIsAddingCompany] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const fundUUID = localStorage.getItem("fund_uuid");
    const [newCompany, setNewCompany] = useState({
        fund_id: fundUUID,
        name: "",
        category: "",
        website: "",
        description: ""
    });

    const getPortfolioCompanies = async () => {
        try {
            const response = await fetch('https://limitless-backend.vercel.app/api/get-fund-portcos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: fundUUID }),
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

    const handleAddCompany = async (e) => {
        e.preventDefault();
        setIsAddingCompany(true);
        try {
            const response = await fetch('https://limitless-backend.vercel.app/api/add-fund-portco', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCompany),
            });
            
            if (!response.ok) {
                throw new Error('Failed to add company');
            }

            // Reset form and refresh companies
            setNewCompany({
                fund_id: fundUUID,
                name: "",
                category: "",
                website: "",
                description: ""
            });
            await getPortfolioCompanies();
            // Close dialog on success
            setDialogOpen(false);
            
        } catch (error) {
            console.error('Error adding portfolio company:', error);
        } finally {
            setIsAddingCompany(false);
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
                <div className="flex justify-between items-center mb-8">
                    <SectionHeader title="Portfolio Companies" description="Companies currently backed by your firm" />
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2" disabled={isAddingCompany}>
                                <Plus className="h-4 w-4" />
                                Add Company
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Portfolio Company</DialogTitle>
                                <DialogDescription>
                                    Add a new company to your portfolio. Fill in the company details below.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddCompany} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Company Name</Label>
                                    <Input
                                        id="name"
                                        value={newCompany.name}
                                        onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                                        placeholder="Enter company name"
                                        required
                                        disabled={isAddingCompany}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={newCompany.category}
                                        onChange={(e) => setNewCompany({...newCompany, category: e.target.value})}
                                        placeholder="e.g., AI/ML, Fintech, SaaS"
                                        required
                                        disabled={isAddingCompany}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={newCompany.website}
                                        onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                                        placeholder="example.com"
                                        required
                                        disabled={isAddingCompany}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newCompany.description}
                                        onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                                        placeholder="Brief description of the company"
                                        rows={3}
                                        disabled={isAddingCompany}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isAddingCompany}>
                                        {isAddingCompany ? "Adding..." : "Add Company"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

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
                                                {company.category && (Array.isArray(company.category) ? 
                                                    company.category.map((cat, idx) => (
                                                        <Badge key={idx} variant="outline">{cat}</Badge>
                                                    )) : 
                                                    <Badge variant="outline">{company.category}</Badge>
                                                )}
                                            </div>
                                            <div className="mt-2 text-sm space-y-1">
                                                <p>
                                                    <strong>Website:</strong>{" "}
                                                    <a
                                                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
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
            <GPCopilotWidget />
        </>
    );
};

export default Portfolio;
