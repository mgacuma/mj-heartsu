import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Share } from "lucide-react";

interface AddToHomeScreenPromptProps {
  onClose: () => void;
}

const AddToHomeScreenPrompt: React.FC<AddToHomeScreenPromptProps> = ({
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    console.log("AddToHomeScreenPrompt mounted");
    const handler = (e: Event) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if the device is iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    console.log("Is iOS device:", isIOSDevice);
    setIsIOS(isIOSDevice);

    // Log if the app is in standalone mode (installed)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    console.log("Is app in standalone mode:", isStandalone);

    return () => {
      console.log("AddToHomeScreenPrompt unmounted");
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("Install prompt outcome:", outcome);
      setDeferredPrompt(null);
    } else {
      console.log("No deferred prompt available");
    }
    onClose();
  };

  // Always render the prompt for debugging purposes
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg">Add to Home Screen</h3>
        {isIOS ? (
          <p className="text-sm text-gray-600">
            Tap the share button <Share className="inline h-4 w-4" /> and then
            'Add to Home Screen' to install
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Install this app on your device for quick and easy access!
          </p>
        )}
      </div>
      <div className="flex items-center">
        {!isIOS && (
          <Button onClick={handleInstall} className="mr-2">
            Install
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AddToHomeScreenPrompt;
