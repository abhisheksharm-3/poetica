import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Feather, BarChart3, Zap, Palette, Globe } from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Emotional Intelligence",
      description: "Captures nuanced human emotions, translating complex feelings into verse."
    },
    {
      icon: Feather,
      title: "Versatile Poetry Styles",
      description: "From classic sonnets to contemporary free verse, tailored to your vision."
    },
    {
      icon: BarChart3,
      title: "Instant Analysis",
      description: "Real-time insights into sentiment and literary techniques."
    },
    {
      icon: Zap,
      title: "Rapid Generation",
      description: "Create compelling, original poems in seconds with AI assistance."
    },
    {
      icon: Palette,
      title: "Creative Control",
      description: "Fine-tune tone, style, and emotional landscape intuitively."
    },
    {
      icon: Globe,
      title: "Multilingual",
      description: "Generate and analyze poetry across multiple languages."
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
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          custom={0}
          className="text-3xl md:text-4xl font-serif tracking-tight text-center mb-20"
        >
          Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index + 1}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border group-hover:border-foreground/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors" 
                      strokeWidth={1.5} 
                    />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground pl-14">
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