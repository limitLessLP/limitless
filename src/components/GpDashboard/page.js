import { MetricCard } from "../../ui/metricsCard.tsx"
import { Button } from "../../ui/button.tsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card.tsx"
import { Badge } from "../../ui/badge.tsx"
import { ArrowRight, MessageSquare, Users, Briefcase, TrendingUp, Plus, ChevronRight } from "lucide-react"
import { Navbar } from "./navbar.js"
import { Footer } from "../Common/Footer.js"
import { GPCopilotWidget } from "./GPCopilotWidget.js"
import { useEffect, useState } from "react"
import { SkeletonWrapper } from "../Common/skeleton.js"
import { Input } from "../../ui/input.jsx"
import { Label } from "../../ui/label.jsx"
import { Textarea } from "../../ui/textarea.jsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../ui/dialog.jsx"

export default function GPDashboard() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [portfolioCompanies, setPortfolioCompanies] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [expandedDeal, setExpandedDeal] = useState(null);
  const gpUUID = localStorage.getItem("gp_uuid");
  const fundUUID = localStorage.getItem("fund_uuid");

  const [newCompany, setNewCompany] = useState({
    fund_id: fundUUID,
    name: "",
    category: "",
    website: "",
    description: ""
  });

  const getDeals = () => {
    setLoading(true);
    const endpoint = "https://limitless-backend.vercel.app/api/get-gp-deal-flow-referrals";
    return fetch(endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gp_uuid: gpUUID }),
      }
    )
    .then(response => response.json())
    .then(data => {
      setDeals(data.referrals || [])
      setLoading(false)
    })
    .catch(error => {
      console.error("Error fetching deals:", error)
      setLoading(false)
    });
  }

  const getAnnouncements = async () => {
    try {
      const endpoint = 'https://limitless-backend.vercel.app/api/get-fund-announcements';
      setAnnouncementsLoading(true);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: fundUUID
        })
      });
      const data = await response.json();
      if (data) {
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
    setAnnouncementsLoading(false);
  }

  const getPortfolioCompanies = async () => {
    try {
      setPortfolioLoading(true);
      const response = await fetch('https://limitless-backend.vercel.app/api/get-fund-portcos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: fundUUID }),
      });
      const data = await response.json();
      if (data) {
        setPortfolioCompanies(data.portCos || []);
      }
    } catch (error) {
      console.error('Error fetching portfolio companies:', error);
    }
    setPortfolioLoading(false);
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
    getDeals();
    getAnnouncements();
    getPortfolioCompanies();
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow p-12">
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    <>
                        <SkeletonWrapper loading={true} rows={1} width="w-full" height="h-32" />
                        <SkeletonWrapper loading={true} rows={1} width="w-full" height="h-32" />
                        <SkeletonWrapper loading={true} rows={1} width="w-full" height="h-32" />
                        <SkeletonWrapper loading={true} rows={1} width="w-full" height="h-32" />
                    </>
                ) : (
                    <>
                        <MetricCard
                            title="Total LPs"
                            value="42"
                            description="Active limited partners"
                            icon={<Users className="h-4 w-4" />}
                            trend={{ value: 12, isPositive: true }}
                        />
                        <MetricCard
                            title="LP Responses"
                            value="128"
                            description="Across all announcements"
                            icon={<MessageSquare className="h-4 w-4" />}
                            trend={{ value: 8, isPositive: true }}
                        />
                        <MetricCard
                            title="Talent Pool"
                            value="86"
                            description="Candidates submitted by LPs"
                            icon={<Briefcase className="h-4 w-4" />}
                            trend={{ value: 15, isPositive: true }}
                        />
                        <MetricCard
                            title="Deal Flow"
                            value={deals.length.toString()}
                            description="Startups referred by LPs"
                            icon={<TrendingUp className="h-4 w-4" />}
                            trend={{ value: 5, isPositive: true }}
                        />
                    </>
                )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Card className="premium-card">
                <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                    <CardDescription>Your latest broadcasts to LPs</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 min-h-[200px]">
                    {announcementsLoading ? (
                        <SkeletonWrapper loading={announcementsLoading} rows={3} width="w-full" height="h-24" />
                    ) : announcements.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                            No announcements found. Create your first announcement!
                        </div>
                    ) : (
                        announcements.slice(0, 3).map((announcement, i) => (
                            <div
                            key={i}
                            className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                            >
                            <div>
                                <h3 className="font-medium">{announcement.title}</h3>
                                <p className="text-sm text-muted-foreground">{announcement.subject}</p>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                                {new Date(announcement.date).toLocaleDateString('en-US', { 
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </Badge>
                            </div>
                        ))
                    )}
                    </div>
                </CardContent>
                <CardFooter>
                    <a href="/gp-announcements" className="w-full">
                    <Button variant="outline" className="w-full">
                        View All Announcements
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </a>
                </CardFooter>
                </Card>

                <Card className="premium-card">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Portfolio Companies</CardTitle>
                            <CardDescription>Your current investments</CardDescription>
                        </div>
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
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 min-h-[200px]">
                    {portfolioLoading ? (
                        <SkeletonWrapper loading={portfolioLoading} rows={3} width="w-full" height="h-24" />
                    ) : portfolioCompanies.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                            No portfolio companies found. Add your first company!
                        </div>
                    ) : (
                        portfolioCompanies.slice(0, 3).map((company, i) => (
                            <div
                            key={i}
                            className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                            >
                            <div>
                                <h3 className="font-medium">{company.name}</h3>
                                <p className="text-sm text-muted-foreground">{company.description?.slice(0, 60)}{company.description?.length > 60 ? '...' : ''}</p>
                            </div>
                            <Badge variant="outline">
                                {company.category}
                            </Badge>
                            </div>
                        ))
                    )}
                    </div>
                </CardContent>
                <CardFooter>
                    <a href="/gp-portfolio" className="w-full">
                    <Button variant="outline" className="w-full">
                        View All Companies
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </a>
                </CardFooter>
                </Card>
            </div>

            <div className="mt-8">
                <Card className="premium-card">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Recent LP-Referred Deal Flow</CardTitle>
                            <CardDescription>Startups referred by your limited partners</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 min-h-[200px]">
                    {loading ? (
                        <SkeletonWrapper loading={loading} rows={3} width="w-full" height="h-24" />
                    ) : deals.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                            No referrals found. Start building your network!
                        </div>
                    ) : (
                        deals.slice(0, 3).map((deal, index) => (
                            <div key={deal.referralUUID}>
                                <div
                                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0 cursor-pointer"
                                onClick={() => setExpandedDeal(expandedDeal === index ? null : index)}
                                >
                                    <div className="flex items-center gap-2">
                                        <ChevronRight 
                                            className={`h-4 w-4 transition-transform ${expandedDeal === index ? 'rotate-90' : ''}`}
                                        />
                                        <div>
                                            <h3 className="font-medium">{deal.companyInfo.companyName}</h3>
                                            {deal.companyInfo.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {deal.companyInfo.description?.slice(0, 60)}{deal.companyInfo.description?.length > 60 ? '...' : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(deal.createdAt).toLocaleDateString('en-US', { 
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <Badge
                                        className={
                                            deal.state === "New"
                                            ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/30"
                                            : deal.state === "Reviewing"
                                                ? "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/30"
                                                : deal.state === "Meeting Scheduled"
                                                ? "bg-purple-900/30 text-purple-300 hover:bg-purple-900/30"
                                                : deal.state === "Interested"
                                                ? "bg-green-900/30 text-green-300 hover:bg-green-900/30"
                                                : "bg-gray-900/30 text-gray-300 hover:bg-gray-900/30"
                                        }
                                        >
                                        {deal.state}
                                        </Badge>
                                    </div>
                                </div>
                                {expandedDeal === index && (
                                    <div className="mt-4 pl-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Company Details</h4>
                                                {deal.companyInfo.website && (
                                                    <p className="text-sm">
                                                        <span className="text-muted-foreground">Website: </span>
                                                        <a href={deal.companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                            {deal.companyInfo.website}
                                                        </a>
                                                    </p>
                                                )}
                                                {deal.companyInfo.linkedinURL && deal.companyInfo.linkedinURL !== "stealth" && (
                                                    <p className="text-sm">
                                                        <span className="text-muted-foreground">LinkedIn: </span>
                                                        <a href={deal.companyInfo.linkedinURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                            Company Profile
                                                        </a>
                                                    </p>
                                                )}
                                                <p className="text-sm mt-2">
                                                    <span className="text-muted-foreground">Relationship: </span>
                                                    {deal.LPRelationshipDesc}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Founders</h4>
                                                <div className="space-y-2">
                                                    {deal.companyInfo.founders.map((founder, i) => (
                                                        <div key={i} className="text-sm">
                                                            <p className="font-medium">{founder.name}</p>
                                                            <div className="flex gap-2 text-blue-500">
                                                                {founder.email && (
                                                                    <a href={`mailto:${founder.email}`} className="hover:underline">Email</a>
                                                                )}
                                                                {founder.linkedin && (
                                                                    <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {portfolioCompanies.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Portfolio Companies in Similar Space</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {portfolioCompanies.slice(0, 4).map((company, i) => (
                                                        <div key={i} className="text-sm p-2 border rounded">
                                                            <p className="font-medium">{company.name}</p>
                                                            <p className="text-muted-foreground">{company.category}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    </div>
                </CardContent>
                <CardFooter>
                    <a href="/gp-deal-flow" className="w-full">
                    <Button variant="outline" className="w-full">
                        View All Referrals
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </a>
                </CardFooter>
                </Card>
            </div>
        </div>
        <Footer />
        <GPCopilotWidget />
    </div>
  )
}
