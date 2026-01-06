"use client"

import { motion } from 'framer-motion'

const DemoSection = () => {
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
    <section id="demo" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          {/* Sample Output - Right Aligned (alternating from HowItWorks' left) */}
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
                Example
              </p>
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>

            <div className="clear-both" />

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-serif tracking-tight">
                  exemplum
                </h2>
                <p className="text-lg text-muted-foreground font-mono tracking-wide">
                  /ɪɡˈzempləm/
                </p>
                <p className="text-sm text-muted-foreground">
                  a sample output demonstrating capability <span className="italic font-serif text-foreground">.n</span>
                </p>
              </div>

              {/* The Poem */}
              <motion.div
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariant}
                className="space-y-4 pt-4"
              >
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <span className="text-sm text-muted-foreground">
                    generated in <span className="font-mono">1.2s</span> • contemplative
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-muted-foreground">
                    Free Verse
                  </span>
                </div>

                <div className="space-y-3 py-4">
                  <p className="text-xl font-serif leading-relaxed italic">
                    In twilight&apos;s embrace, whispers unfold,
                  </p>
                  <p className="text-xl font-serif leading-relaxed italic">
                    Echoes of dreams, stories untold.
                  </p>
                  <p className="text-xl font-serif leading-relaxed italic">
                    Moonlit shadows dance and sway,
                  </p>
                  <p className="text-xl font-serif leading-relaxed italic">
                    As night&apos;s symphony begins to play.
                  </p>
                </div>

                <p className="text-sm text-muted-foreground italic">
                  AI-generated, ready for editing and personalization —
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default DemoSection