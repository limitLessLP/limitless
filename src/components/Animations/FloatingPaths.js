import { motion } from "framer-motion";

export function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(255,255,255,${0.3 + i * 0.02})`, // Increased opacity and set to pure white
    width: 0.8 + i * 0.05, // Slightly increased width for visibility
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-2000">
      <svg
        className="w-full h-full text-white" // Set text color to white for contrast
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color} // Use the calculated color
            strokeWidth={path.width}
            strokeOpacity={0.5 + path.id * 0.02} // Increased base opacity
            initial={{ pathLength: 0.3, opacity: 0.7 }} // Make the initial opacity higher
            animate={{
              pathLength: 1,
              opacity: [0.6, 1, 0.6], // Increased opacity range
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
