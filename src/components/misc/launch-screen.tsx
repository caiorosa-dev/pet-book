"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/misc/logo";
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';

interface LaunchScreenProps {
  onFinished?: () => void;
  duration?: number;
  className?: string;
}

export function LaunchScreen({
  onFinished,
  duration = 2000,
  className,
}: LaunchScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      // Wait for animation to complete before removing from DOM
      const animationTimer = setTimeout(() => {
        setIsVisible(false);
        if (onFinished) {
          onFinished();
        }
      }, 1000); // Match the duration-1000 in the className
      
      return () => clearTimeout(animationTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinished]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center flex-col gap-4 bg-background transition-opacity duration-1000",
        isAnimating ? "opacity-0" : "opacity-100",
        className
      )}
    >
      <Logo 
        className="animate-pulse transition-all duration-1000 h-12"
      />
      <Loader2 className="animate-spin transition-all duration-1000 text-primary" />
    </div>
  );
}
