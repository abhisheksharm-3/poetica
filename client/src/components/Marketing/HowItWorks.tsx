import React from 'react'
import { motion } from 'framer-motion'
import { Wand2, PenTool, BookOpen, ChevronRight } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      title: "Choose Mood & Theme",
      description: "Select the emotional tone and creative direction for your poem.",
      icon: Wand2,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Select Poetry Style",
      description: "Pick from classic forms like sonnet, haiku, or free verse.",
      icon: PenTool,
      color: "text-blue-500", 
      bgColor: "bg-blue-50"
    },
    {
      title: "Generate & Analyze",
      description: "Receive a unique AI-crafted poem with deep literary insights.",
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50"
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
          How Poetica Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-12 md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100 
                }}
                className="flex flex-col items-center text-center max-w-xs"
              >
                <div className={`
                  ${step.bgColor} 
                  ${step.color} 
                  p-6 rounded-full mb-6 
                  shadow-lg transition-all 
                  group-hover:scale-105
                  flex items-center justify-center
                `}>
                  <step.icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {step.description}
                </p>
              </motion.div>
              {index < steps.length - 1 && (
                <div className="hidden md:block">
                  <ChevronRight 
                    className="w-8 h-8 text-muted-foreground" 
                    strokeWidth={1.5} 
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks