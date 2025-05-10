import { motion } from "framer-motion";
import {
  BrainCircuit,
  Database,
  BarChart2,
  Activity,
  Server,
  LineChart,
  Cpu,
  Code2,
  Network,
} from "lucide-react";

const icons = [
  BrainCircuit, Database, BarChart2, Activity, // orta sıra (4)
  Server, LineChart, Cpu,                     // üst sıra (3)
  Code2, Network,                             // alt sıra (2)
];

const positions = [
  // ÜST SIRA (3)
  { top: "10%", left: "25%" },
  { top: "8%", left: "50%" },
  { top: "10%", left: "75%" },

  // ORTA SIRA (4)
  { top: "40%", left: "15%" },
  { top: "42%", left: "38%" },
  { top: "42%", left: "62%" },
  { top: "40%", left: "85%" },

  // ALT SIRA (2)
  { top: "75%", left: "33%" },
  { top: "75%", left: "66%" },
];

const AnimatedPattern = () => {
  return (
    <div className="hidden md:flex items-center justify-center h-full w-[80%] bg-base-200 relative overflow-hidden">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ opacity: 0, y: 20, x: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [-10, 0, 10],
            x: [0, 5, -5],
          }}
          transition={{
            duration: 6 + index * 0.4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={{
            top: positions[index].top,
            left: positions[index].left,
          }}
        >
          <Icon className="text-primary opacity-40 w-10 h-10" />
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedPattern;
