import React, { useState, useRef, useCallback, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Heart, Loader2, Bell } from "lucide-react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Button } from "@/components/ui/button";
import ggbr1 from "../assets/ggbr-1.jpeg";
import ggbr2 from "../assets/ggbr-2.jpeg";
import ggbr3 from "../assets/ggbr-3.jpeg";
import ggbr4 from "../assets/ggbr-4.jpeg";

interface FloatingContent {
  id: number;
  x: number;
  y: number;
  imageIndex: number;
}

const dogImages = [ggbr1, ggbr2, ggbr3, ggbr4];

const HeartCounter: React.FC = () => {
  const [hearts, loading, error] = useDocumentData(doc(db, "babu", "hearts"));
  const [floatingContent, setFloatingContent] = useState<FloatingContent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef<number | null>(null);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const localUpdateRef = useRef(false);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (hearts) {
      document.title = `I love you babu | ${hearts.count}`;

      if (
        previousCountRef.current !== null &&
        hearts.count > previousCountRef.current &&
        containerRef.current &&
        !localUpdateRef.current
      ) {
        addFloatingContent();

        if (notificationPermission === "granted") {
          sendNotification(
            "New Love from Babu!",
            `Heart count is now ${hearts.count}`
          );
        }
      }

      previousCountRef.current = hearts.count;
      localUpdateRef.current = false;
    }
  }, [hearts, notificationPermission]);

  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    return {
      x: Math.random() * (rect.width - 100),
      y: Math.random() * (rect.height - 100),
    };
  };

  const addFloatingContent = () => {
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
  };

  const incrementHeart = useCallback(async () => {
    if (hearts && containerRef.current) {
      localUpdateRef.current = true;
      await updateDoc(doc(db, "babu", "hearts"), {
        count: hearts.count + 1,
      });
      addFloatingContent();
    }
  }, [hearts]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === "granted") {
          await registerServiceWorker();
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/mj-heartsu/sw.js",
          { scope: "/mj-heartsu/" }
        );
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  };

  const sendNotification = (title: string, body: string) => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: body,
          icon: "/mj-heartsu/ggbr-favicon.jpeg",
          badge: "/mj-heartsu/ggbr-favicon.jpeg",
        });
      });
    }
  };

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
      <div className="max-w-2xl text-center px-4 sm:px-6 lg:px-0 mb-8">
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
      {notificationPermission !== "granted" && (
        <div className="flex justify-center">
          <Button
            onClick={requestNotificationPermission}
            className="flex items-center justify-center"
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeartCounter;
