import { SectionHeader } from "../../ui/sectionHeader.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx"
import { Badge } from "../../ui/badge.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx"
import { Input } from "../../ui/input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select.jsx"
import { Button } from "../../ui/button.tsx"
import { Search } from "lucide-react"
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
  const gp_uuid = localStorage.getItem("gp_uuid");
  const [loading, setLoading] = useState(false);

  const getDeals = () => {
    setLoading(true);
    const endpoint = "https://limitless-backend.vercel.app/api/get-gp-deal-flow-referrals";
      return fetch(endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gp_uuid: gp_uuid }),
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

  return (
    <div className="min-h-screen flex flex-col">
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
                          <DealCard key={deal.referralUUID} deal={deal} />
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
                            <DealCard key={deal.referralUUID} deal={deal} />
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
  )
}

function DealCard({ deal }) {
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
          <Select defaultValue={deal.state.toLowerCase().replace(" ", "-")}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="meeting-scheduled">Meeting Scheduled</SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Details
          </Button>
        </div>
      </div>
    </div>
  )
}
