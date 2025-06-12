import { SectionHeader } from "../../ui/sectionHeader.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx"
import { Badge } from "../../ui/badge.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx"
import { Input } from "../../ui/input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select.jsx"
import { Button } from "../../ui/button.tsx"
import { Search, X, User, Building, Calendar, ExternalLink, Mail, Linkedin } from "lucide-react"
import { Navbar } from "./navbar.js"
import { Footer } from "../Common/Footer.js"
import { GPCopilotWidget } from "./GPCopilotWidget.js"
import { useEffect, useState } from "react"
import { SkeletonWrapper } from "../Common/skeleton.js"

const MetricCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
    <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 w-12 bg-gray-200 rounded"></div>
  </div>
);

export default function DealFlow() {
  const [deals, setDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const gpUUID = localStorage.getItem("gp_uuid");
  const [loading, setLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [lpInfo, setLpInfo] = useState(null);
  const [lpLoading, setLpLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  useEffect(() => {
    getDeals();
  }, [])

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = searchTerm === "" || 
      deal.companyInfo.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.companyInfo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.LPRelationshipDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.companyInfo.founders.some(founder => 
        founder.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStage = selectedStage === "all" || deal.state.toLowerCase() === selectedStage;

    return matchesSearch && matchesStage;
  });

  const openDealDetail = async (deal) => {
    setSelectedDeal(deal);
    setIsDetailOpen(true);
    setLpLoading(true);
    setLpInfo(null);

    try {
      const response = await fetch(`https://limitless-backend.vercel.app/api/user-info?id=${deal.lpUUID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLpInfo(data);
      }
    } catch (error) {
      console.error("Error fetching LP info:", error);
    } finally {
      setLpLoading(false);
    }
  };

  const closeDealDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => {
      setSelectedDeal(null);
      setLpInfo(null);
    }, 300); // Wait for slide-out animation
  };

  const updateReferralState = async (referralId, newState) => {
    try {
      const response = await fetch("https://limitless-backend.vercel.app/api/update-referral-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referral_id: referralId,
          new_state: newState
        }),
      });

      if (response.ok) {
        // Update local state
        setDeals(prevDeals => 
          prevDeals.map(deal => 
            deal.referralUUID === referralId 
              ? { ...deal, state: newState }
              : deal
          )
        );

        // Update selected deal if it's the one being updated
        if (selectedDeal && selectedDeal.referralUUID === referralId) {
          setSelectedDeal(prev => ({ ...prev, state: newState }));
        }
      } else {
        console.error("Failed to update referral state");
      }
    } catch (error) {
      console.error("Error updating referral state:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className={`transition-all duration-300 ${isDetailOpen ? 'blur-sm' : ''}`}>
        <Navbar />
        <div className="container mx-auto py-24 flex-grow">      
        <SectionHeader title="LP-Referred Deal Flow" description="Startups referred by your limited partners" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <MetricCardSkeleton />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{deals.length}</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top Industry</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <MetricCardSkeleton />
                ) : (
                  <>
                    <div className="text-2xl font-bold">AI/ML</div>
                    <p className="text-xs text-muted-foreground">8 referrals</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="premium-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top LP Referrer</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <MetricCardSkeleton />
                ) : (
                  <>
                    <div className="text-2xl font-bold">Sarah Johnson</div>
                    <p className="text-xs text-muted-foreground">5 referrals</p>
                  </>
                )}
              </CardContent>
            </Card>
        </div>

        <div className="mt-8">
            <Card>
            <CardHeader>
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <CardTitle>Startup Referrals</CardTitle>
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                    <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search companies..."
                        className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                    <Select 
                      value={selectedStage}
                      onValueChange={setSelectedStage}
                    >
                    <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Filter by stage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="meeting scheduled">Meeting Scheduled</SelectItem>
                        <SelectItem value="interested">Interested</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                    <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
                    <TabsTrigger value="meeting">Meeting</TabsTrigger>
                    <TabsTrigger value="interested">Interested</TabsTrigger>
                    <TabsTrigger value="passed">Passed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                    <div className="space-y-4">
                    {loading ? (
                        <SkeletonWrapper loading={loading} rows={3} width="w-full" height="h-24" />
                    ) : filteredDeals.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                            No referrals found. Start building your network!
                        </div>
                    ) : (
                    filteredDeals.map((deal) => (
                          <DealCard key={deal.referralUUID} deal={deal} onDetailsClick={() => openDealDetail(deal)} onStateChange={updateReferralState} />
                    )))}
                    </div>
                </TabsContent>
                {["new", "reviewing", "meeting", "interested", "passed"].map((status) => (
                    <TabsContent key={status} value={status} className="mt-4">
                    <div className="space-y-4">
                        {filteredDeals
                        .filter((d) => {
                            const dealState = d.state.toLowerCase();
                            if (status === "new") return dealState === "new";
                            if (status === "reviewing") return dealState === "reviewing";
                            if (status === "meeting") return dealState === "meeting scheduled";
                            if (status === "interested") return dealState === "interested";
                            if (status === "passed") return dealState === "passed";
                            return false;
                        })
                        .map((deal) => (
                            <DealCard key={deal.referralUUID} deal={deal} onDetailsClick={() => openDealDetail(deal)} onStateChange={updateReferralState} />
                        ))}
                    </div>
                    </TabsContent>
                ))}
                </Tabs>
            </CardContent>
            </Card>
        </div>
      </div>
      <Footer />
      <GPCopilotWidget />
      </div>
      
      {/* Deal Detail Sliding Window */}
      <DealDetailSlider 
        deal={selectedDeal}
        lpInfo={lpInfo}
        lpLoading={lpLoading}
        isOpen={isDetailOpen}
        onClose={closeDealDetail}
        onStateChange={updateReferralState}
      />
    </div>
  )
}

function DealCard({ deal, onDetailsClick, onStateChange }) {
  return (
    <div className="flex flex-col rounded-lg border p-4 transition-all hover:bg-accent/50 sm:flex-row sm:items-start">
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-medium">{deal.companyInfo.companyName}</h3>
          <Badge
            className={`ml-2 ${
              deal.state === "New"
                ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/30"
                : deal.state === "Reviewing"
                  ? "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/30"
                  : deal.state === "Meeting Scheduled"
                    ? "bg-purple-900/30 text-purple-300 hover:bg-purple-900/30"
                    : deal.state === "Interested"
                      ? "bg-green-900/30 text-green-300 hover:bg-green-900/30"
                      : "bg-gray-900/30 text-gray-300 hover:bg-gray-900/30"
            }`}
          >
            {deal.state}
          </Badge>
        </div>
        {deal.companyInfo.description && (
          <p className="mt-2 text-sm text-muted-foreground">{deal.companyInfo.description}</p>
        )}
        <p className="mt-2 text-sm">LP Relationship: <span className="text-muted-foreground">{deal.LPRelationshipDesc}</span></p>
        <div className="mt-3">
          <p className="text-sm font-medium mb-2">Founders:</p>
          <div className="space-y-2">
            {deal.companyInfo.founders.map((founder, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{founder.name}</span>
                  <div className="flex space-x-2">
                    {founder.email && (
                      <a 
                        href={`mailto:${founder.email}`} 
                        className="text-xs text-blue-500 hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Email
                      </a>
                    )}
                    {founder.linkedin && (
                      <a 
                        href={founder.linkedin}
                        className="text-xs text-blue-500 hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {deal.companyInfo.companyWebsite && (
            <a 
              href={deal.companyInfo.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Badge variant="outline">Website</Badge>
            </a>
          )}
          {deal.companyInfo.linkedinURL && deal.companyInfo.linkedinURL !== "stealth" && (
            <a 
              href={deal.companyInfo.linkedinURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Badge variant="outline">Company LinkedIn</Badge>
            </a>
          )}
        </div>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-start sm:items-end">
        <p className="text-xs text-muted-foreground">{new Date(deal.createdAt).toLocaleDateString()}</p>
        <div className="mt-2 flex gap-2">
          <Select 
            value={deal.state} 
            onValueChange={(value) => onStateChange(deal.referralUUID, value)}
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Reviewing">Reviewing</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Interested">Interested</SelectItem>
              <SelectItem value="Passed">Passed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onDetailsClick}>
            Details
          </Button>
        </div>
      </div>
    </div>
  )
}

function DealDetailSlider({ deal, lpInfo, lpLoading, isOpen, onClose, onStateChange }) {
  if (!deal) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 border-l shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <Building className="h-6 w-6" />
              <h2 className="text-xl font-semibold">{deal.companyInfo.companyName}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Deal Status */}
            <div>
              <h3 className="text-lg font-medium mb-3">Deal Status</h3>
              <div className="flex items-center space-x-3">
                <Badge
                  className={`${
                    deal.state === "New"
                      ? "bg-blue-900/30 text-blue-300"
                      : deal.state === "Reviewing"
                        ? "bg-yellow-900/30 text-yellow-300"
                        : deal.state === "Meeting Scheduled"
                          ? "bg-purple-900/30 text-purple-300"
                          : deal.state === "Interested"
                            ? "bg-green-900/30 text-green-300"
                            : "bg-gray-900/30 text-gray-300"
                  }`}
                >
                  {deal.state}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(deal.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-medium mb-3">Company Information</h3>
              <div className="space-y-3">
                {deal.companyInfo.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm mt-1">{deal.companyInfo.description}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {deal.companyInfo.companyWebsite && (
                    <a 
                      href={deal.companyInfo.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-600"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Website</span>
                    </a>
                  )}
                  {deal.companyInfo.linkedinURL && deal.companyInfo.linkedinURL !== "stealth" && (
                    <a 
                      href={deal.companyInfo.linkedinURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-600"
                    >
                      <Linkedin className="h-3 w-3" />
                      <span>Company LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Founders */}
            <div>
              <h3 className="text-lg font-medium mb-3">Founders</h3>
              <div className="space-y-4">
                {deal.companyInfo.founders.map((founder, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{founder.name}</span>
                    </div>
                    <div className="flex space-x-4">
                      {founder.email && (
                        <a 
                          href={`mailto:${founder.email}`} 
                          className="inline-flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Mail className="h-3 w-3" />
                          <span>Email</span>
                        </a>
                      )}
                      {founder.linkedin && (
                        <a 
                          href={founder.linkedin}
                          className="inline-flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-3 w-3" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LP Information */}
            <div>
              <h3 className="text-lg font-medium mb-3">Referring Limited Partner</h3>
              <div className="border rounded-lg p-4">
                <div className="mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                  <p className="text-sm mt-1">{deal.LPRelationshipDesc}</p>
                </div>
                
                {lpLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                ) : lpInfo?.user ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">LP Name</p>
                      <p className="text-sm mt-1">{`${lpInfo.user.firstName} ${lpInfo.user.lastName}`}</p>
                    </div>
                    {lpInfo.user.email && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <a 
                          href={`mailto:${lpInfo.user.email}`}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          {lpInfo.user.email}
                        </a>
                      </div>
                    )}
                    {lpInfo.user.phone && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <a 
                          href={`tel:${lpInfo.user.phone}`}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          {lpInfo.user.phone}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">LP information not available</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t p-6">
            <div className="flex justify-between items-center">
              <Select 
                value={deal.state} 
                onValueChange={(value) => onStateChange(deal.referralUUID, value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Reviewing">Reviewing</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Interested">Interested</SelectItem>
                  <SelectItem value="Passed">Passed</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
