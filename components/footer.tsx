import { HeartIcon, TrophyIcon, UsersIcon, LeafIcon } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-md py-6 mt-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-2 text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            <span>Built with</span>
            <HeartIcon className="h-4 w-4 text-red-500" />
            <span>by Team Karnan</span>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            <UsersIcon className="h-4 w-4 text-primary" />
            <span className="font-medium">Team Members:</span>
            <span>Goodwell Sreejith S</span>
            <span>•</span>
            <span>Vasudha</span>
            <span>•</span>
            <span>Nikhil</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2 text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            <TrophyIcon className="h-4 w-4 text-yellow-500" />
            <span>EcoInnovators Ideathon 2026</span>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-4 pt-4 border-t text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2">
            <LeafIcon className="h-3 w-3 text-green-500" />
            <span>AI-Powered Solar Verification Platform for India's Clean Energy Future</span>
            <LeafIcon className="h-3 w-3 text-green-500" />
          </div>
          <div className="mt-1">
            © {new Date().getFullYear()} Karnan Solar Verification Platform • Global Learning Council
          </div>
        </motion.div>
      </div>
    </footer>
  )
}