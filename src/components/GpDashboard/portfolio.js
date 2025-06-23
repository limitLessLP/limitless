import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx";
import { Badge } from "../../ui/badge.tsx";
import { Navbar } from "./navbar.js";
import { Footer } from "../Common/Footer.js";
import { SectionHeader } from "../../ui/sectionHeader.tsx";
import { SkeletonWrapper } from "../Common/skeleton";
import { Button } from "../../ui/button.tsx";
import { GPCopilotWidget } from "./GPCopilotWidget.js";
import { Plus, Users, Calendar, DollarSign, Eye, Building } from "lucide-react";
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
    const [coInvestmentDialogOpen, setCoInvestmentDialogOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [coInvestments, setCoInvestments] = useState([]);
    const [coInvestmentsLoading, setCoInvestmentsLoading] = useState(false);
    const [isCreatingCoInvestment, setIsCreatingCoInvestment] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
    const fundUUID = localStorage.getItem("fund_uuid");
    const gpUUID = localStorage.getItem("gp_uuid");
    
    const [newCompany, setNewCompany] = useState({
        fund_id: fundUUID,
        name: "",
        category: "",
        website: "",
        description: ""
    });

    const [newCoInvestment, setNewCoInvestment] = useState({
        gp_uuid: gpUUID,
        fund_uuid: fundUUID,
        portco_uuid: "",
        closing_date: "",
        total_allocation: ""
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

    const getCoInvestments = async () => {
        try {
            setCoInvestmentsLoading(true);
            const response = await fetch(`https://limitless-backend.vercel.app/api/get-gp-co-investments?gp_uuid=${gpUUID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data && data.co_investments) {
                setCoInvestments(data.co_investments);
            } else {
                setCoInvestments([]);
            }
        } catch (error) {
            console.error('Error fetching co-investments:', error);
            setCoInvestments([]);
        } finally {
            setCoInvestmentsLoading(false);
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

    const handleCreateCoInvestment = async (e) => {
        e.preventDefault();
        setIsCreatingCoInvestment(true);
        try {
            const response = await fetch('https://limitless-backend.vercel.app/api/open-co-investment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCoInvestment),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create co-investment');
            }

            // Reset form and refresh co-investments
            setNewCoInvestment({
                gp_uuid: gpUUID,
                portco_uuid: "",
                closing_date: "",
                total_allocation: ""
            });
            await getCoInvestments();
            // Close dialog on success
            setCoInvestmentDialogOpen(false);
            
        } catch (error) {
            console.error('Error creating co-investment:', error);
            alert(error.message);
        } finally {
            setIsCreatingCoInvestment(false);
        }
    };

    const handleCloseCoInvestment = async (coInvestmentId) => {
        try {
            const response = await fetch('https://limitless-backend.vercel.app/api/close-co-investment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    co_investment_id: coInvestmentId,
                    gp_uuid: gpUUID
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to close co-investment');
            }

            await getCoInvestments();
            
        } catch (error) {
            console.error('Error closing co-investment:', error);
            alert(error.message);
        }
    };

    const openCoInvestmentDialog = (company) => {
        setSelectedCompany(company);
        setNewCoInvestment({
            ...newCoInvestment,
            portco_uuid: company.portcoUUID
        });
        setCoInvestmentDialogOpen(true);
    };

    const openDetailsDialog = (company) => {
        setSelectedCompanyDetails(company);
        setDetailsDialogOpen(true);
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'OPEN':
                return 'default';
            case 'FULL':
                return 'secondary';
            case 'CLOSED':
                return 'destructive';
            case 'CANCELLED':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    useEffect(() => {
        getPortfolioCompanies();
        getCoInvestments();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow container mx-auto py-24">
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

                {/* Co-Investment Opportunities Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Co-Investment Opportunities
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SkeletonWrapper loading={coInvestmentsLoading} rows={2} height="h-24" />

                        {!coInvestmentsLoading && coInvestments.length > 0 ? (
                            <div className="grid gap-4">
                                {coInvestments.map((coInvestment, index) => (
                                    <Card key={index} className="border-l-4 border-l-blue-500">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start p-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <h3 className="font-medium">Co-Investment Opportunity</h3>
                                                        <Badge variant={getStatusBadgeVariant(coInvestment.status)}>
                                                            {coInvestment.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-gray-500" />
                                                            <span>Total: {formatCurrency(coInvestment.total_allocation)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-gray-500" />
                                                            <span>Collected: {formatCurrency(coInvestment.funds_collected)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            <span>Closes: {formatDate(coInvestment.closing_date)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 text-sm text-gray-600">
                                                        <span className="font-medium">LPs Registered:</span> {coInvestment.lp_uuids?.length || 0}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {coInvestment.status === 'OPEN' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCloseCoInvestment(coInvestment._id)}
                                                        >
                                                            Close
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : !coInvestmentsLoading && (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">No co-investment opportunities created yet.</p>
                                <p className="text-sm text-gray-400">Create co-investment opportunities for your portfolio companies to allow LPs to invest alongside your fund.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

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
                                        <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col gap-2 items-start sm:items-end">
                                            <Button
                                                onClick={() => openCoInvestmentDialog(company)}
                                                className="flex items-center gap-2"
                                            >
                                                <Users className="h-4 w-4" />
                                                Enable Co-Investment
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => openDetailsDialog(company)}
                                            >
                                                View Details
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

                {/* Co-Investment Creation Dialog */}
                <Dialog open={coInvestmentDialogOpen} onOpenChange={setCoInvestmentDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Co-Investment Opportunity</DialogTitle>
                            <DialogDescription>
                                {selectedCompany && `Create a co-investment opportunity for ${selectedCompany.name}. LPs will be able to invest alongside your fund.`}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateCoInvestment} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="total_allocation">Total Allocation ($)</Label>
                                <Input
                                    id="total_allocation"
                                    type="number"
                                    value={newCoInvestment.total_allocation}
                                    onChange={(e) => setNewCoInvestment({...newCoInvestment, total_allocation: e.target.value})}
                                    placeholder="e.g., 1000000"
                                    required
                                    disabled={isCreatingCoInvestment}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="closing_date">Closing Date</Label>
                                <Input
                                    id="closing_date"
                                    type="text"
                                    value={newCoInvestment.closing_date}
                                    onChange={(e) => setNewCoInvestment({...newCoInvestment, closing_date: e.target.value})}
                                    placeholder="MM/DD/YYYY (e.g., 12/31/2024)"
                                    required
                                    disabled={isCreatingCoInvestment}
                                />
                                <p className="text-xs text-gray-500">Use MM/DD/YYYY format</p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCoInvestmentDialogOpen(false)}
                                    disabled={isCreatingCoInvestment}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isCreatingCoInvestment}>
                                    {isCreatingCoInvestment ? "Creating..." : "Create Opportunity"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Company Details Dialog */}
                <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                {selectedCompanyDetails?.name} - Company Details
                            </DialogTitle>
                            <DialogDescription>
                                Comprehensive view of portfolio company information and co-investment opportunities
                            </DialogDescription>
                        </DialogHeader>
                        
                        {selectedCompanyDetails && (
                            <div className="space-y-6">
                                {/* Company Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Company Information</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-600">Company Name</Label>
                                                    <p className="text-sm">{selectedCompanyDetails.name}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {selectedCompanyDetails.category && (Array.isArray(selectedCompanyDetails.category) ? 
                                                            selectedCompanyDetails.category.map((cat, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">{cat}</Badge>
                                                            )) : 
                                                            <Badge variant="outline" className="text-xs">{selectedCompanyDetails.category}</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-600">Website</Label>
                                                    <a
                                                        href={selectedCompanyDetails.website.startsWith('http') ? selectedCompanyDetails.website : `https://${selectedCompanyDetails.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline text-sm block mt-1"
                                                    >
                                                        {selectedCompanyDetails.website}
                                                    </a>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                                                    <p className="text-sm text-gray-700 mt-1">{selectedCompanyDetails.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Co-Investment Status</h3>
                                            <div className="space-y-3">
                                                {coInvestments.filter(ci => ci.portco_uuid === selectedCompanyDetails._id || ci.portco_uuid === selectedCompanyDetails.id).length > 0 ? (
                                                    coInvestments.filter(ci => ci.portco_uuid === selectedCompanyDetails._id || ci.portco_uuid === selectedCompanyDetails.id).map((coInvestment, index) => (
                                                        <Card key={index} className="border-l-4 border-l-blue-500">
                                                            <CardContent className="p-3">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <Badge variant={getStatusBadgeVariant(coInvestment.status)}>
                                                                        {coInvestment.status}
                                                                    </Badge>
                                                                    {coInvestment.status === 'OPEN' && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                handleCloseCoInvestment(coInvestment._id);
                                                                                setDetailsDialogOpen(false);
                                                                            }}
                                                                        >
                                                                            Close
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                    <div>
                                                                        <span className="text-gray-600">Total:</span>
                                                                        <p className="font-medium">{formatCurrency(coInvestment.total_allocation)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-600">Collected:</span>
                                                                        <p className="font-medium">{formatCurrency(coInvestment.funds_collected)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-600">LPs:</span>
                                                                        <p className="font-medium">{coInvestment.lp_uuids?.length || 0}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-600">Closes:</span>
                                                                        <p className="font-medium">{formatDate(coInvestment.closing_date)}</p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                                        <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500 mb-3">No co-investment opportunities</p>
                                                        <Button
                                                            onClick={() => {
                                                                openCoInvestmentDialog(selectedCompanyDetails);
                                                                setDetailsDialogOpen(false);
                                                            }}
                                                            size="sm"
                                                        >
                                                            Create Co-Investment
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => setDetailsDialogOpen(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            openCoInvestmentDialog(selectedCompanyDetails);
                                            setDetailsDialogOpen(false);
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <Users className="h-4 w-4" />
                                        Enable Co-Investment
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <Footer />
            <GPCopilotWidget />
        </div>
    );
};

export default Portfolio;
