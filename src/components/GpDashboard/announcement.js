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
import { ChevronLeft, ChevronRight, X, MessageSquare } from "lucide-react"

export default function NewAnnouncement() {
  const navigate = useNavigate();
  const gpUUID = localStorage.getItem("gp_uuid");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [announcementRequest, setAnnouncementRequest] = useState({
    title: "",
    content: "",
    subject: "",
    comments_enabled: false,
  })
  const [announcements, setAnnouncements] = useState([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const announcementsPerPage = 5
  const fund = localStorage.getItem("fund_uuid");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isTogglingComments, setIsTogglingComments] = useState(false);

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

  const makeAnnouncement = (title, content, subject, comments_enabled) => {
    const body = {
      title: title,
      message: content,
      subject: subject,
      fundId: fund,
      userId: gpUUID,
      comments_enabled: comments_enabled,
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
          comments_enabled: false,
        });
      })
      .catch(error => {
        console.error('Error making announcement:', error);
      });
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { title, content, subject, comments_enabled } = announcementRequest;

    if (title && content && subject) {
      makeAnnouncement(title, content, subject, comments_enabled);
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

  const fetchComments = async (announcementId) => {
    try {
      setCommentsLoading(true);
      const response = await fetch('https://limitless-backend.vercel.app/api/get-announcement-comment-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ann_id: announcementId
        })
      });
      const data = await response.json();
      if (data) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    if (announcement.comments_enabled) {
      fetchComments(announcement.ann_id);
    }
  };

  const toggleComments = async (announcementId, currentStatus) => {
    try {
      setIsTogglingComments(true);
      const response = await fetch('https://limitless-backend.vercel.app/api/toggle-announcement-comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ann_id: announcementId,
          comments_enabled: !currentStatus
        })
      });
      const data = await response.json();
      if (data) {
        // Update the announcement in the local state
        setAnnouncements(prevAnnouncements => 
          prevAnnouncements.map(ann => 
            ann.ann_id === announcementId 
              ? { ...ann, comments_enabled: !currentStatus }
              : ann
          )
        );
        // Update the selected announcement
        setSelectedAnnouncement(prev => ({
          ...prev,
          comments_enabled: !currentStatus
        }));
        // If comments are being disabled, clear the comments
        if (currentStatus) {
          setComments([]);
        } else {
          // If comments are being enabled, fetch them
          fetchComments(announcementId);
        }
      }
    } catch (error) {
      console.error('Error toggling comments:', error);
    } finally {
      setIsTogglingComments(false);
    }
  };

  return (
    <>
      <div className={`min-h-screen flex flex-col ${selectedAnnouncement ? 'blur-sm' : ''}`}>
        <Navbar />
        <div className="flex-grow px-12 pt-24 pb-12 w-full relative">
          <div className="flex gap-8">
            {/* Left Column - New Announcement Form */}
            <div className="w-[45%]">
              <SectionHeader title="New Announcement" description="Create a new broadcast message for your LPs" />
              <Card className="mt-8">
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

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="comments_enabled"
                        checked={announcementRequest.comments_enabled}
                        onChange={(e) => setAnnouncementRequest({ ...announcementRequest, comments_enabled: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <Label htmlFor="comments_enabled">Enable comments for this announcement</Label>
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
            </div>

            {/* Right Column - Announcements List */}
            <div className="w-[55%]">
              <SectionHeader title="Announcements" description="View and manage your announcements" />
              <Card className="mt-8">
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
                          className="border border-gray-200 shadow-md rounded-2xl p-4 bg-white transition hover:shadow-lg cursor-pointer"
                          onClick={() => handleAnnouncementClick(announcement)}
                        >
                          <CardContent className="space-y-4">
                            <div className="pt-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="py-2 text-lg font-semibold text-gray-800">{announcement.title}</p>
                                  <p className="py-2 text-base text-gray-700">{announcement.subject}</p>
                                  <p className="py-2 text-base text-gray-700 whitespace-pre-line">{announcement.message}</p>
                                  <p className="py-2 text-sm text-gray-600">{announcement.date ? new Date(announcement.date).toDateString() : "N/A"}</p>
                                </div>
                                {announcement.comments_enabled && (
                                  <div className="flex items-center space-x-1 text-gray-500">
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="text-sm">{comments.length}</span>
                                  </div>
                                )}
                              </div>
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
          </div>
        </div>
        <Footer />
        <GPCopilotWidget />
      </div>

      {/* Comments Panel - Rendered outside the blurred container */}
      {selectedAnnouncement && (
        <div className="fixed top-0 right-0 h-full w-[55%] bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0 z-50">
          <div className="h-full overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedAnnouncement.title}</h2>
                  <p className="text-gray-600">{selectedAnnouncement.subject}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleComments(selectedAnnouncement.ann_id, selectedAnnouncement.comments_enabled)}
                    disabled={isTogglingComments}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {isTogglingComments ? "Updating..." : selectedAnnouncement.comments_enabled ? "Disable Comments" : "Enable Comments"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedAnnouncement(null)}
                    className="hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-line">{selectedAnnouncement.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(selectedAnnouncement.date).toLocaleString()}
                  </p>
                </div>

                {selectedAnnouncement.comments_enabled ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    {commentsLoading ? (
                      <div className="min-h-[200px]">
                        <SkeletonWrapper loading={true} rows={3} height="h-16" />
                      </div>
                    ) : comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.comment_id} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">
                            LP ID: {comment.lp_id} • {new Date(comment.created_at).toLocaleString()}
                          </p>
                          <p className="whitespace-pre-line">{comment.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No comments yet
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Comments are disabled for this announcement
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
