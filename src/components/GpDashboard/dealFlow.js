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

export default function DealFlow() {
  const [deals, setDeals] = useState([]);
  const fund = localStorage.getItem("fund");
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
          body: JSON.stringify({ gp_uuid: fund }),
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

  return (
    <>
    <Navbar />
      <div className="container mx-auto py-24">      
        <SectionHeader title="LP-Referred Deal Flow" description="Startups referred by your limited partners" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="premium-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
            </Card>
            <Card className="premium-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top Industry</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">AI/ML</div>
                <p className="text-xs text-muted-foreground">8 referrals</p>
            </CardContent>
            </Card>
            <Card className="premium-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top LP Referrer</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Sarah Johnson</div>
                <p className="text-xs text-muted-foreground">5 referrals</p>
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
                    />
                    </div>
                    <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Filter by stage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        <SelectItem value="pre-seed">Pre-seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B+</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="All">
                <TabsList>
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="New">New</TabsTrigger>
                    <TabsTrigger value="Reviewing">Reviewing</TabsTrigger>
                    <TabsTrigger value="Meeting">Meeting</TabsTrigger>
                    <TabsTrigger value="Interested">Interested</TabsTrigger>
                    <TabsTrigger value="Passed">Passed</TabsTrigger>
                </TabsList>
                <TabsContent value="All" className="mt-4">
                    <div className="space-y-4">
                    {loading ? (
                        <SkeletonWrapper loading={loading} rows={3} width="w-full" height="h-24" />
                    ) : deals.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                            No referrals found. Start building your network!
                        </div>
                    ) : (
                    deals.map((deal) => (
                          <DealCard key={deal.id} deal={deal} />
                    )))}
                    </div>
                </TabsContent>
                {["new", "reviewing", "meeting", "interested", "passed"].map((status) => (
                    <TabsContent key={status} value={status} className="mt-4">
                    <div className="space-y-4">
                        {deals
                        .filter((d) => {
                            if (status === "new") return d.status === "New"
                            if (status === "reviewing") return d.status === "Reviewing"
                            if (status === "meeting") return d.status === "Meeting Scheduled"
                            if (status === "interested") return d.status === "Interested"
                            if (status === "passed") return d.status === "Passed"
                            return false
                        })
                        .map((deal) => (
                            <DealCard key={deal.id} deal={deal} />
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
    </>
    
  )
}

function DealCard({ deal }) {
  return (
    <div className="flex flex-col rounded-lg border p-4 transition-all hover:bg-accent/50 sm:flex-row sm:items-center">
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
        <p className="mt-1 text-sm">{deal.LPRelationshipDesc}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">{deal.companyInfo.companyWebsite}</Badge>
          <Badge variant="outline">{deal.companyInfo.linkedinURL}</Badge>
        </div>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-start sm:items-end">
        <p className="text-sm">
          Referred by <span className="font-medium">{deal.companyInfo.founders[0]?.name}</span>
        </p>
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
