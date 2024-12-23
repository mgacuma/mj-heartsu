import React, { useState, useRef, useCallback } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Heart, Loader2 } from "lucide-react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Button } from "@/components/ui/button";

interface Hearts {
  count: number;
}

interface FloatingContent {
  id: number;
  x: number;
  y: number;
  imageIndex: number;
}

const dogImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FF7A09B3-D948-43DB-8974-4510434F9AF9_1_102_o-q2jtM3I4c7KjQhocrW54HODQCAFZZR.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FA67AA1E-C487-43A8-AF80-99B7EDC48108_1_102_o-4AMSF1XbwjTKf4HKMmWe4b2aEQ2g49.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/023A6480-43EE-4A73-BED1-A975DB6B16C5_1_102_o-OFFCyoXQZ8JTmAUYV5uZJR3r9bgSBf.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/61F5E64E-07C9-49F3-8432-17C142FD93E3_1_102_o-nFn8Hb8r45l24F2Ao1SKGCDKGSy4N0.jpeg",
];

const HeartCounter: React.FC = () => {
  const [hearts, loading, error] = useDocumentData(doc(db, "babu", "hearts"));
  const [floatingContent, setFloatingContent] = useState<FloatingContent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    return {
      x: Math.random() * (rect.width - 100),
      y: Math.random() * (rect.height - 100),
    };
  };

  const incrementHeart = useCallback(async () => {
    if (hearts && containerRef.current) {
      await updateDoc(doc(db, "babu", "hearts"), {
        count: hearts.count + 1,
      });

      const { x, y } = getRandomPosition();
      const newFloatingContent: FloatingContent = {
        id: Date.now(),
        x,
        y,
        imageIndex: Math.floor(Math.random() * dogImages.length),
      };

      setFloatingContent((prev) => [...prev, newFloatingContent]);

      setTimeout(() => {
        setFloatingContent((prev) =>
          prev.filter((content) => content.id !== newFloatingContent.id)
        );
      }, 1500);
    }
  }, [hearts]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">I Love U Babu</h1>
        <div className="flex flex-col items-center">
          <Button
            onClick={incrementHeart}
            disabled={loading}
            className="flex items-center justify-center p-6 bg-white rounded-full shadow-lg hover:bg-red-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? (
              <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
            ) : (
              <Heart className="w-16 h-16 text-red-500" fill="currentColor" />
            )}
          </Button>
          {error ? (
            <p className="text-xl text-red-500">Error: {error.message}</p>
          ) : hearts ? (
            <p className="text-3xl font-bold text-gray-700">{hearts.count}</p>
          ) : null}
        </div>
      </div>
      <div className="max-w-2xl text-center px-4 sm:px-6 lg:px-0">
        <h2 className="text-2xl font-semibold mb-2">Babu's Haiku</h2>
        <p className="text-gray-600 italic">
          Babu my love
          <br />
          Together through ups and downs
          <br />
          Ride or die
        </p>
      </div>
      {floatingContent.map((content) => (
        <div
          key={content.id}
          className="absolute pointer-events-none animate-float-and-fade"
          style={{
            left: `${content.x}px`,
            top: `${content.y}px`,
          }}
        >
          <img
            src={dogImages[content.imageIndex]}
            alt="GGBR"
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
          <p className="text-red-500 font-bold text-lg text-center">
            +1 I love u babu
          </p>
        </div>
      ))}
    </div>
  );
};

export default HeartCounter;
