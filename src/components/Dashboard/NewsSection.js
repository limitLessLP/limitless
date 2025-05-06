import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

export const NewsSection = () => {
  const [news, setNews] = useState([]);

  async function getData(pageSize = 20, pageNumber = 1) {
    const url = new URL('https://limitless-backend.vercel.app/api/news/');
    url.searchParams.append('page', pageNumber);
    url.searchParams.append('limit', pageSize);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setNews(data.articles || []);
      console.log(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const [showAll, setShowAll] = useState(false);

  const displayedNews = showAll ? news : news.slice(0, 5);

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 ">Latest News & Insights</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>
      <div className="space-y-4">
        {(displayedNews ?? []).map((item, index) => (
          <motion.a
            key={item.id}
            href={item.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 ">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{item.source}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{(item.published ?? "").split(" ").slice(0,4).join(" ")}</span>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
} 