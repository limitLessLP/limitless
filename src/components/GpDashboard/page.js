import { MetricCard } from "../../ui/metricsCard.tsx"
import { Button } from "../../ui/button.tsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card.tsx"
import { Badge } from "../../ui/badge.tsx"
import { ArrowRight, MessageSquare, Users, Briefcase, TrendingUp } from "lucide-react"
import { Navbar } from "./navbar.js"
import { Footer } from "../Common/Footer.js"

export default function GPDashboard() {
  return (
    <>
        <Navbar />
        <div className="mx-auto p-12">
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    value="24"
                    description="Startups referred by LPs"
                    icon={<TrendingUp className="h-4 w-4" />}
                    trend={{ value: 5, isPositive: true }}
                />
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Card className="premium-card">
                <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                    <CardDescription>Your latest broadcasts to LPs</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {[
                        {
                        title: "Q1 Fund Performance Update",
                        date: "Mar 15, 2025",
                        responses: 18,
                        },
                        {
                        title: "New Portfolio Company: TechCorp",
                        date: "Mar 10, 2025",
                        responses: 24,
                        },
                        {
                        title: "Annual LP Meeting Announcement",
                        date: "Mar 5, 2025",
                        responses: 32,
                        },
                    ].map((announcement, i) => (
                        <div
                        key={i}
                        className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                        >
                        <div>
                            <h3 className="font-medium">{announcement.title}</h3>
                            <p className="text-sm text-muted-foreground">{announcement.date}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                            {announcement.responses} responses
                        </Badge>
                        </div>
                    ))}
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
                    <CardTitle>LP Value-Add Reports</CardTitle>
                    <CardDescription>Monthly reports on LP contributions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {[
                        {
                        title: "February 2025 Report",
                        date: "Mar 5, 2025",
                        highlight: "12 new talent submissions",
                        },
                        {
                        title: "January 2025 Report",
                        date: "Feb 5, 2025",
                        highlight: "8 expert office hours conducted",
                        },
                        {
                        title: "December 2024 Report",
                        date: "Jan 5, 2025",
                        highlight: "5 startup referrals",
                        },
                    ].map((report, i) => (
                        <div
                        key={i}
                        className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                        >
                        <div>
                            <h3 className="font-medium">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">{report.highlight}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{report.date}</span>
                        </div>
                    ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <a href="/gp-reports" className="w-full">
                    <Button variant="outline" className="w-full">
                        View All Reports
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </a>
                </CardFooter>
                </Card>
            </div>

            <div className="mt-8">
                <Card className="premium-card">
                <CardHeader>
                    <CardTitle>Recent LP-Referred Deal Flow</CardTitle>
                    <CardDescription>Startups referred by your limited partners</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {[
                        {
                        company: "NeuralTech AI",
                        industry: "Artificial Intelligence",
                        stage: "Series A",
                        referrer: "Sarah Johnson",
                        status: "New",
                        },
                        {
                        company: "GreenEnergy Solutions",
                        industry: "CleanTech",
                        stage: "Seed",
                        referrer: "Michael Chen",
                        status: "Reviewing",
                        },
                        {
                        company: "HealthSync",
                        industry: "HealthTech",
                        stage: "Pre-seed",
                        referrer: "Emily Williams",
                        status: "Meeting Scheduled",
                        },
                    ].map((deal, i) => (
                        <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                        >
                        <div>
                            <h3 className="font-medium">{deal.company}</h3>
                            <p className="text-sm text-muted-foreground">
                            {deal.industry} • {deal.stage}
                            </p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                            <p className="text-sm">Referred by {deal.referrer}</p>
                            <Badge
                            className={
                                deal.status === "New"
                                ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/30"
                                : deal.status === "Reviewing"
                                    ? "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/30"
                                    : "bg-green-900/30 text-green-300 hover:bg-green-900/30"
                            }
                            >
                            {deal.status}
                            </Badge>
                        </div>
                        </div>
                    ))}
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
    </>
  )
}
