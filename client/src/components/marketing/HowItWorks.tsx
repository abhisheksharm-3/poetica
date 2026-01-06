"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const HowItWorks = () => {
  const steps = [
    {
      label: "Configure",
      description: "Select emotional tone, poetic style, and creative parameters. The AI adapts to your artistic vision."
    },
    {
      label: "Generate",
      description: "Watch as the algorithm transforms your parameters into original verse, crafted in seconds."
    },
    {
      label: "Refine",
      description: "Edit, regenerate, or save. Each poem becomes part of your personal collection."
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
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          {/* Section Content - Left Aligned (alternating from Features' right) */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="space-y-8 border-l-4 border-primary/20 pl-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Process
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
                  modus operandi
                </h2>
                <p className="text-lg text-muted-foreground font-mono tracking-wide">
                  /ˌməʊdəs ˌɒpəˈrændi/
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="italic font-serif text-foreground">n.</span> the method of working; the way something operates
                </p>
              </div>

              <div className="space-y-5 pt-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    custom={index + 1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUpVariant}
                    className="group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-mono text-primary mt-1">{index + 1}.</span>
                      <div className="space-y-1">
                        <span className="text-lg font-medium">{step.label}</span>
                        <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row items-start gap-4 pl-8"
          >
            <Button size="lg" className="text-base h-12 px-8 shadow-lg hover:shadow-xl transition-shadow" asChild>
              <Link href="/create">
                Begin Creating
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks