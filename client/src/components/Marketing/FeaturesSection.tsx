import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Feather, BarChart3, Zap, PaletteIcon, Globe } from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Emotional Intelligence",
      description: "Our advanced neural network captures nuanced human emotions, translating complex feelings into poetic expression.",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      gradient: "from-purple-500 to-purple-700"
    },
    {
      icon: Feather,
      title: "Versatile Poetry Styles",
      description: "Explore an extensive range of poetic forms, from classic sonnets to contemporary free verse, tailored to your creative vision.",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      icon: BarChart3,
      title: "Instant Poem Analysis",
      description: "Receive deep, real-time insights into sentiment, literary techniques, and emotional resonance of generated poetry.",
      color: "text-green-500",
      bgColor: "bg-green-50",
      gradient: "from-green-500 to-green-700"
    },
    {
      icon: Zap,
      title: "Rapid Generation",
      description: "Create compelling, original poems in seconds, powered by state-of-the-art language models and creative algorithms.",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      gradient: "from-orange-500 to-orange-700"
    },
    {
      icon: PaletteIcon,
      title: "Creative Customization",
      description: "Fine-tune your poem's tone, style, and emotional landscape with intuitive, powerful customization options.",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      gradient: "from-pink-500 to-pink-700"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Generate and analyze poetry across multiple languages, bridging cultural and linguistic boundaries.",
      color: "text-teal-500",
      bgColor: "bg-teal-50",
      gradient: "from-teal-500 to-teal-700"
    }
  ]

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
          Poetica&apos;s Innovative Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100 
              }}
              className="group"
            >
              <div className={`
                border border-border rounded-xl 
                p-6 h-full flex flex-col 
                hover:shadow-xl transition-all duration-300
                hover:bg-gradient-to-br ${feature.gradient} 
                hover:text-white group-hover:scale-105
              `}>
                <div className={`
                  ${feature.bgColor} 
                  ${feature.color} 
                  p-4 rounded-full 
                  mb-6 w-16 h-16 
                  flex items-center justify-center
                  transition-all duration-300
                  group-hover:rotate-12
                `}>
                  <feature.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className={`
                  text-xl font-semibold mb-4 
                  ${feature.color} group-hover:text-white
                `}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-white/80 flex-grow">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection