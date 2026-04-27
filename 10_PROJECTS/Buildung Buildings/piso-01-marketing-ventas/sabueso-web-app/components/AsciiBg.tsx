"use client";

import { useEffect, useState } from "react";

interface AsciiBgProps {
  file: string;
  opacity?: number;
}

export default function AsciiBg({ file, opacity = 0.4 }: AsciiBgProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    fetch(file)
      .then((res) => res.json())
      .then((data) => {
        setFrames(data);
      })
      .catch((err) => console.warn("ASCII BG load failed:", file));
  }, [file]);

  useEffect(() => {
    if (frames.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 150);

    return () => clearInterval(intervalId);
  }, [frames]);

  if (frames.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 flex items-center justify-center mix-blend-screen">
      <pre
        className="text-[#00ff00] font-mono whitespace-pre drop-shadow-[0_0_15px_rgba(0,255,0,1)]"
        style={{
          fontSize: "2vw",
          lineHeight: 0.75,
          transform: "scale(1.8)",
          opacity: opacity,
        }}
      >
        {frames[currentFrame]}
      </pre>
    </div>
  );
}
