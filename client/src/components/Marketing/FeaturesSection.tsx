"use client"

import { motion } from 'framer-motion'
import { Brain, Feather, Sparkles, Palette } from 'lucide-react'

const FeaturesSection = () => {
  const capabilities = [
    {
      icon: Brain,
      term: "Emotional Intelligence",
      pronunciation: "/ɪˌməʊʃənl ɪnˈtelɪdʒəns/",
      definition: "The capacity to capture nuanced human emotions, translating complex feelings into verse with remarkable depth and sensitivity."
    },
    {
      icon: Feather,
      term: "Poetic Versatility",
      pronunciation: "/pəʊˈetɪk ˌvɜːsəˈtɪlɪti/",
      definition: "Mastery across classic forms — from the structured elegance of sonnets to the flowing freedom of free verse, each tailored to your vision."
    },
    {
      icon: Sparkles,
      term: "Generative Creation",
      pronunciation: "/ˈdʒenərətɪv kriˈeɪʃən/",
      definition: "The act of producing compelling, original poetry in seconds through AI assistance, preserving authentic artistic expression."
    },
    {
      icon: Palette,
      term: "Creative Sovereignty",
      pronunciation: "/kriˈeɪtɪv ˈsɒvrənti/",
      definition: "Complete control over tone, style, and emotional landscape through intuitive adjustments and fine-tuned parameters."
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
        ease: [0.215, 0.61, 0.355, 1] as const
      }
    })
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          {/* Section Header - Right Aligned (alternating from Hero's left) */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="space-y-8 border-r-4 border-primary/20 pr-8 text-right"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full float-right">
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Capabilities
              </p>
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>

            <div className="clear-both" />

            <div className="space-y-4">
              {capabilities.map((item, index) => (
                <motion.div
                  key={index}
                  custom={index + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUpVariant}
                  className="group"
                >
                  <div className="flex items-start gap-3 justify-end">
                    <div className="space-y-2 text-right">
                      <div className="flex items-center gap-3 flex-wrap justify-end">
                        <span className="text-sm text-muted-foreground font-mono">{item.pronunciation}</span>
                        <span className="text-lg font-serif font-medium">{item.term}</span>
                        <item.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                        {item.definition}
                      </p>
                    </div>
                    <span className="text-sm font-mono text-primary mt-1">.{index + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection