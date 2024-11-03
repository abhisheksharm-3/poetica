import React from 'react'
import { motion } from 'framer-motion'
import { Wand2, PenTool, BookOpen } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      title: "Choose Mood & Theme",
      description: "Select the emotional tone and creative direction for your poem.",
      icon: Wand2
    },
    {
      title: "Select Poetry Style",
      description: "Pick from classic forms like sonnet, haiku, or free verse.",
      icon: PenTool
    },
    {
      title: "Generate & Analyze",
      description: "Receive a unique AI-crafted poem with deep literary insights.",
      icon: BookOpen
    }
  ]

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="space-y-2 text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
            How Poetica Works
          </h2>
          <p className="text-base text-muted-foreground">
            Create meaningful poetry in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index + 1}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="relative"
            >
              <div className="space-y-6">
                <div className="relative">
                  {/* Connection lines */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-[3rem] right-0 h-[2px] bg-gradient-to-r from-blue-200 to-transparent -translate-y-1/2" />
                  )}
                  
                  {/* Icon container */}
                  <div className="relative z-10 inline-flex">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50" />
                      <div className="relative h-12 w-12 flex items-center justify-center rounded-full border border-blue-200 bg-white">
                        <step.icon className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">
                      0{index + 1}
                    </span>
                    <h3 className="text-lg font-medium">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks