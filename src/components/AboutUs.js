import { Globe, Activity, LineChart } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutUsPage = () => {
    return (
        <>
        <a href="/" className="inline-flex items-center gap-2 text-black hover:text-gray-500 transition-colors mb-12 mt-8 ml-8">
            <ArrowLeft size={20} />
            <span>Back</span>
        </a>
        {/* Vision Section - Keep but simplified */}
        <section className="relative z-10 py-32 px-8 border-t border-white/10">
            <div className="text-center mb-20">
                <div className="mt-32">
                    <div className="container mx-auto px-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-extralight mb-8">Our Vision</h2>
                            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
                            Building the future of venture capital investment through innovative technology and inclusive access.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                        icon: Globe,
                        title: "Democratizing Access",
                        description: "Creating a world where access to venture capital is no longer exclusive—publicizing the private market for ordinary accredited investors.",
                        hoverColor: "text-blue-400"
                        },
                        {
                        icon: Activity,
                        title: "Revolutionizing Returns",
                        description: "Breaking industry norms with higher premium carry and fees, while diversifying LP bases with individuals who become portcos' customers.",
                        hoverColor: "text-purple-400"
                        },
                        {
                        icon: LineChart,
                        title: "Superior Performance",
                        description: "Providing access to the highest IRR asset class with minimal monitoring, revolutionizing traditional GP-LP relationships.",
                        hoverColor: "text-green-400"
                        }
                    ].map((card) => (
                        <div key={card.title} className="group backdrop-blur-sm bg-white/5 rounded-xl p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                        <card.icon className={`w-8 h-8 mb-4 text-gray-400 group-hover:${card.hoverColor} transition-colors duration-500`} />
                        <h3 className="text-lg font-medium mb-4">{card.title}</h3>
                        <p className="text-gray-400 font-light leading-relaxed">
                            {card.description}
                        </p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </section>
        </>
        
    )
}