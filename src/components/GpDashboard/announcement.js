import { useState, useEffect } from "react"
import { SectionHeader } from "../../ui/sectionHeader.tsx"
import { Button } from "../../ui/button.tsx"
import { Card, CardContent } from "../..//ui/card.tsx"
import { Input } from "../../ui/input.jsx"
import { Label } from "../../ui/label.jsx"
import { Textarea } from "../../ui/textarea.jsx"
import { useNavigate } from "react-router-dom"
import { Navbar } from "./navbar.js"
import { Footer } from "../Common/Footer.js"
import { SkeletonWrapper } from "../Common/skeleton";
import { GPCopilotWidget } from "./GPCopilotWidget.js"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function NewAnnouncement() {
  const navigate = useNavigate();
  const gpUUID = localStorage.getItem("gp_uuid");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [announcementRequest, setAnnouncementRequest] = useState({
    title: "",
    content: "",
    subject: "",
  })
  const [announcements, setAnnouncements] = useState([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const announcementsPerPage = 5
  const fund = localStorage.getItem("fund_uuid");

  const fetchAnnouncements = async () => {
    try {
      const endpoint = 'https://limitless-backend.vercel.app/api/get-fund-announcements';
      setLoading(true);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: fund
        })
      });
      const data = await response.json();
      if (data) {
        setAnnouncements(data.announcements);
      } else {
        console.error('Failed to fetch announcements:', data.message);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAnnouncements();
  }, [])

  useEffect(() => {
    if (announcements && announcements.length > 0) {
      setFilteredAnnouncements(announcements);
      setCurrentPage(1); // Reset to first page when announcements change
    }
  }, [announcements]);

  const makeAnnouncement = (title, content, subject) => {
    const body = {
      title: title,
      message: content,
      subject: subject,
      fundId: fund,
      userId: gpUUID,
    }
    fetch('https://limitless-backend.vercel.app/api/make-announcement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Announcement created:', data);
        fetchAnnouncements();
        setAnnouncementRequest({
          title: "",
          content: "",
          subject: "",
        });
      })
      .catch(error => {
        console.error('Error making announcement:', error);
      });
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { title, content, subject } = announcementRequest;

    if (title && content && subject) {
      makeAnnouncement(title, content, subject);
    } else {
      alert("Please fill in all fields.");
    }
    
    setIsSubmitting(false);
  }

  // Get current announcements
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

  const handleSearch = (searchTerm) => {
    const filtered = announcements.filter(announcement => 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnnouncements(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow px-12 py-12 w-full">
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
                  value={announcementRequest.title}
                  onChange={(e) => setAnnouncementRequest({...announcementRequest, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="Enter a subject for the announcement" 
                  required 
                  value={announcementRequest.subject}
                  onChange={(e) => setAnnouncementRequest({...announcementRequest, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Announcement Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the details of your announcement"
                  className="min-h-[200px]"
                  required
                  value={announcementRequest.content}
                  onChange={(e) => setAnnouncementRequest({ ...announcementRequest, content: e.target.value })}
                />
              </div>
            </CardContent>
            <CardContent className="flex justify-between items-center pt-4 pb-6">
              <Button 
                type="button" 
                className="bg-black hover:bg-gray-800 text-white" 
                onClick={() => navigate("/gp-dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-black hover:bg-gray-800 text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Announcement"}
              </Button>
            </CardContent>
          </form>
        </Card>
        <Card className="mt-8 max-w-3xl mx-auto">
          <CardContent className="space-y-4 pt-6">
            <Input 
              id="search" 
              placeholder="Search announcements..." 
              className="w-full mb-4"
              onChange={(e) => handleSearch(e.target.value)}
              disabled={loading || !announcements}
            />
            {loading ? (
              <div className="min-h-[300px]">
                <SkeletonWrapper loading={true} rows={3} height="h-32" />
              </div>
            ) : currentAnnouncements.length > 0 ? (
              <div className="space-y-4 min-h-[300px]">
                {currentAnnouncements.map((announcement, index) => (
                  <Card
                    key={index}
                    className="border border-gray-200 shadow-md rounded-2xl p-4 bg-white transition hover:shadow-lg"
                  >
                    <CardContent className="space-y-4">
                      <div className="pt-2">
                        <p className="py-2 text-lg font-semibold text-gray-800">{announcement.title}</p>
                        <p className="py-2 text-base text-gray-700">{announcement.subject}</p>
                        <p className="py-2 text-base text-gray-700 whitespace-pre-line">{announcement.message}</p>
                        <p className="py-2 text-sm text-gray-600">{announcement.date ? new Date(announcement.date).toDateString() : "N/A"}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center">
                <p className="text-gray-500">No announcements found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
      <GPCopilotWidget />
    </div>
  )
}
