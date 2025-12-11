import { motion } from "framer-motion";
import { Shield, Layers, Zap } from "lucide-react";

const cards = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "All processing happens locally in your browser. No files are ever uploaded to any server.",
  },
  {
    icon: Layers,
    title: "Batch Processing",
    description: "Process multiple HTML files at once. Download individually or as a ZIP archive.",
  },
  {
    icon: Zap,
    title: "Smart Injection",
    description: "Intelligent HTML structure detection ensures scripts are injected in the optimal location.",
  },
];

export function InfoCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-6 rounded-lg glass glass-hover text-center group"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:glow-sm transition-all">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
