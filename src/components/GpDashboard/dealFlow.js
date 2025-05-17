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

export default function DealFlow() {
  const deals = [
    {
      id: "1",
      company: "NeuralTech AI",
      industry: "Artificial Intelligence",
      stage: "Series A",
      referrer: "Sarah Johnson",
      date: "Mar 15, 2025",
      status: "New",
      description: "Building next-generation neural interfaces for human-computer interaction.",
    },
    {
      id: "2",
      company: "GreenEnergy Solutions",
      industry: "CleanTech",
      stage: "Seed",
      referrer: "Michael Chen",
      date: "Mar 12, 2025",
      status: "Reviewing",
      description: "Developing sustainable energy solutions for residential buildings.",
    },
    {
      id: "3",
      company: "HealthSync",
      industry: "HealthTech",
      stage: "Pre-seed",
      referrer: "Emily Williams",
      date: "Mar 10, 2025",
      status: "Meeting Scheduled",
      description: "Creating a platform for seamless healthcare data integration.",
    },
    {
      id: "4",
      company: "FinSecure",
      industry: "FinTech",
      stage: "Seed",
      referrer: "David Thompson",
      date: "Mar 8, 2025",
      status: "Interested",
      description: "Building advanced security solutions for financial institutions.",
    },
    {
      id: "5",
      company: "LogisticsAI",
      industry: "Supply Chain",
      stage: "Series A",
      referrer: "Jennifer Lee",
      date: "Mar 5, 2025",
      status: "Passed",
      description: "Using AI to optimize logistics and supply chain operations.",
    },
    {
      id: "6",
      company: "EdTech Innovators",
      industry: "Education",
      stage: "Seed",
      referrer: "Robert Garcia",
      date: "Mar 3, 2025",
      status: "New",
      description: "Revolutionizing education with adaptive learning technologies.",
    },
  ]

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
                    {deals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
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
    </>
    
  )
}

function DealCard({ deal }) {
  return (
    <div className="flex flex-col rounded-lg border p-4 transition-all hover:bg-accent/50 sm:flex-row sm:items-center">
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-medium">{deal.company}</h3>
          <Badge
            className={`ml-2 ${
              deal.status === "New"
                ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/30"
                : deal.status === "Reviewing"
                  ? "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/30"
                  : deal.status === "Meeting Scheduled"
                    ? "bg-purple-900/30 text-purple-300 hover:bg-purple-900/30"
                    : deal.status === "Interested"
                      ? "bg-green-900/30 text-green-300 hover:bg-green-900/30"
                      : "bg-gray-900/30 text-gray-300 hover:bg-gray-900/30"
            }`}
          >
            {deal.status}
          </Badge>
        </div>
        <p className="mt-1 text-sm">{deal.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">{deal.industry}</Badge>
          <Badge variant="outline">{deal.stage}</Badge>
        </div>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-start sm:items-end">
        <p className="text-sm">
          Referred by <span className="font-medium">{deal.referrer}</span>
        </p>
        <p className="text-xs text-muted-foreground">{deal.date}</p>
        <div className="mt-2 flex gap-2">
          <Select defaultValue={deal.status.toLowerCase().replace(" ", "-")}>
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
