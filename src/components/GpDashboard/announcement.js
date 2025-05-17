import { useState } from "react"
import { SectionHeader } from "../../ui/sectionHeader.tsx"
import { Button } from "../../ui/button.tsx"
import { Card, CardContent, CardFooter } from "../..//ui/card.tsx"
import { Input } from "../../ui/input.jsx"
import { Label } from "../../ui/label.jsx"
import { Textarea } from "../../ui/textarea.jsx"
import { useNavigate } from "react-router-dom"
import { Navbar } from "./navbar.js"
import { Footer } from "../Common/Footer.js"

export default function NewAnnouncement() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [announcementRequest, setAnnouncementRequest] = useState({
    title: "",
    content: "",
    category: "performance"
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log(announcementRequest)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      const message = {
        title: "Announcement created",
        description: "Your announcement has been sent to all LPs",
      };
      console.log(message);
      navigate("/gp-announcements");
    }, 1500)
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto px-12 py-24">
        <SectionHeader title="New Announcement" description="Create a new broadcast message for your LPs" />
        <Card className="mt-8 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Announcement Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter a clear, concise title" 
                  required 
                  onChange={(e) => setAnnouncementRequest({...announcementRequest, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black appearance-none bg-white px-4 py-2 pr-10 text-gray-700 hover:border-gray-400"
                    required
                    defaultValue="performance"
                    onChange={(e) => setAnnouncementRequest({ ...announcementRequest, category: e.target.value })}
                  >
                    <option value="performance">Performance</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="event">Event</option>
                    <option value="request">Request</option>
                    <option value="fund">Fund</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Announcement Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the details of your announcement"
                  className="min-h-[200px]"
                  required
                  onChange={(e) => setAnnouncementRequest({ ...announcementRequest, content: e.target.value })}
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <Input id="attachments" type="file" multiple />
                <p className="text-xs text-muted-foreground">You can attach up to 5 files (PDF, DOCX, XLSX, JPG, PNG)</p>
              </div> */}
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => navigate("/gp-dashboard")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black hover:bg-gray-800 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Announcement"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Footer />
    </>
  )
}
