import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, Server, Network, Code2, Database, BarChart2, Activity, Cloud, Monitor, Download, Wifi, Package, HardDrive, Clipboard, Share2, GitBranch, Layers, Smartphone, Terminal, Link, Sliders, Settings, MapPin, FileText, Mail, Zap, Truck, Heart } from 'lucide-react';

// ML ikonları ve pozisyonları (36 ikon)
const icons = [
  BrainCircuit, Cpu, Server, Network, Code2, Database, BarChart2, Activity, Cloud, Monitor, Download, Wifi,
  Package, HardDrive, Clipboard, Share2, GitBranch, Layers, Smartphone, Terminal, Link, Sliders, Settings, MapPin,
  FileText, Mail, Zap, Truck, Heart, Cloud, Database, BarChart2, Server, Cpu, Monitor, Wifi
];

// Yeni pozisyonlar (sol üst, sağ üst ve ortadaki hizalar daha dengeli olacak)
const positions = [
  { top: "5%", left: "5%" },
  { top: "5%", left: "15%" },
  { top: "10%", left: "10%" },
  { top: "15%", left: "20%" },
  { top: "5%", left: "85%" },
  { top: "5%", left: "75%" },
  { top: "10%", left: "80%" },
  { top: "15%", left: "70%" },
  { top: "25%", left: "30%" },
  { top: "25%", left: "40%" },
  { top: "25%", left: "50%" },
  { top: "30%", left: "35%" },
  { top: "30%", left: "45%" },
  { top: "30%", left: "55%" },
  { top: "35%", left: "40%" },
  { top: "35%", left: "50%" },
  { top: "35%", left: "60%" },
  { top: "40%", left: "40%" },
  { top: "40%", left: "50%" },
  { top: "40%", left: "60%" },
  { top: "60%", left: "25%" },
  { top: "60%", left: "35%" },
  { top: "60%", left: "45%" },
  { top: "65%", left: "40%" },
  { top: "65%", left: "50%" },
  { top: "65%", left: "60%" },
  { top: "70%", left: "45%" },
  { top: "70%", left: "55%" },
  { top: "80%", left: "10%" },
  { top: "80%", left: "90%" },
  { top: "85%", left: "20%" },
  { top: "85%", left: "80%" },
  { top: "90%", left: "30%" },
  { top: "90%", left: "70%" }
];

// Yeni pozisyonlar ve ikonlar sayısının eşleştiğinden emin olun
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-700 z-0 w-full min-h-full">
      {icons.map((Icon, index) => {
        // positions array'inin uzunluğunu icons array'ine eşitlemek
        const position = positions[index % positions.length]; // Eğer pozisyonlar eksikse, döngüsel olarak tekrar eder

        return (
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
              duration: 5 + index * 0.4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            <Icon className="text-gray-500 opacity-50 w-12 h-12" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default AnimatedBackground;
