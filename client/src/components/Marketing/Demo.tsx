import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Bolt } from 'lucide-react'

const DemoSection = () => {
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

  const metrics = [
    { label: 'Joy', value: 70 },
    { label: 'Serenity', value: 85 },
    { label: 'Wonder', value: 60 }
  ]

  return (
    <section id="demo" className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="space-y-2 text-center mb-16"
        >
          <h2 className="text-4xl font-serif tracking-tight">Experience AI Poetry</h2>
          <p className="text-muted-foreground">Watch as algorithms transform into art</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <Card className="backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Generated Output</p>
                  </div>
                  <p className="text-lg font-serif leading-relaxed">
                    In twilight&apos;s embrace, whispers unfold,
                    <br />
                    Echoes of dreams, stories untold.
                    <br />
                    Moonlit shadows dance and sway,
                    <br />
                    As night&apos;s symphony begins to play.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <Card className="backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Emotional Analysis</p>
                  </div>
                  <div className="space-y-4">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{metric.label}</span>
                          <span>{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="mt-12 flex justify-center"
        >
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
            <Bolt className="w-4 h-4" />
            Generated in 1.2 seconds
          </Badge>
        </motion.div>
      </div>
    </section>
  )
}

export default DemoSection