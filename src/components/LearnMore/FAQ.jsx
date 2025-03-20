import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer/Footer";

const sections = [
  {
    title: "Investing",
    faqs: [
      { question: "Who can invest?", answer: "Limitless investments are typically available to accredited investors who meet certain financial requirements." },
      { question: "How does the typical Limitless investment work?", answer: "Investors commit capital to funds, which is drawn down over time as investments are made. Returns are distributed based on fund performance." },
      { question: "What's the minimum commitment?", answer: "The minimum investment amount varies by fund but typically starts at around €50,000." },
      { question: "When is capital drawn on my commitment?", answer: "Capital is drawn down gradually as the fund makes investments. Investors are notified in advance of capital calls." },
      { question: "What's the selection process for the funds on Limitless?", answer: "Limitless follows a rigorous due diligence process to select high-quality private equity and venture capital funds." },
      { question: "What is a typical fund that Limitless offers?", answer: "Limitless offers private equity, venture capital, and other alternative investment funds." },
      { question: "What's Limitless's typical hold period?", answer: "Investments typically have a hold period of 5 to 10 years, depending on the fund structure." }
    ]
  },
  {
    title: "Legal",
    faqs: [
      { question: "What are the risks of investing in a Limitless fund?", answer: "Investing in Limitless funds carries risks, including potential loss of capital, illiquidity, and market fluctuations." },
      { question: "Which fees will I need to pay when investing in a Limitless fund?", answer: "Limitless funds may include management fees, performance fees, and administrative costs, which vary by fund." },
      { question: "Will the Limitless team give me investment advice?", answer: "Limitless does not provide personalized investment advice. Investors should conduct their own research or consult financial advisors." }
    ]
  }
];

const categories = ["All", "Investing", "Legal"];

export const FAQDropdown = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>      
    <Navbar section="faq"/>
    <div className="max-w-2xl mx-auto p-4 text-center pt-60">
      <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-lg mb-4">What do you need help with?</p>
      <div className="flex justify-center gap-2 flex-wrap mb-6">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 border rounded-full ${selectedCategory === category ? "bg-gray-800 text-white" : "bg-white text-black border-gray-300"}`}
          >
            {category}
          </button>
        ))}
      </div>
      {sections.map((section, sectionIndex) => (
        (selectedCategory === "All" || section.title === selectedCategory) && (
          <div key={sectionIndex} className="mb-6 text-left">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="border rounded-lg overflow-hidden">
              {section.faqs.map((faq, index) => (
                <div key={index} className="border-b last:border-none">
                  <button
                    onClick={() => toggleDropdown(`${sectionIndex}-${index}`)}
                    className="w-full flex justify-between items-center p-4 text-left font-medium bg-white hover:bg-gray-100"
                  >
                    {faq.question}
                    {openIndex === `${sectionIndex}-${index}` ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {openIndex === `${sectionIndex}-${index}` && (
                    <div className="p-4 bg-gray-50 text-gray-700">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
    <section className="snap-start relative z-10">
          <Footer />
    </section>
    </>
  );
}