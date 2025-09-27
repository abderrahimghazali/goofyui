"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SolarBirthdayPicker() {
  const [birthdate, setBirthdate] = useState("");
  const [showSolarSystem, setShowSolarSystem] = useState(false);
  const [earthRotation, setEarthRotation] = useState(0);
  const [isHoveringEarth, setIsHoveringEarth] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [yearOffset, setYearOffset] = useState(0);
  const [lastRotation, setLastRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateDateFromRotation = (rotation: number, year: number) => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const dayOfYear = Math.floor((normalizedRotation / 360) * 365) + 1;

    const date = new Date(new Date().getFullYear() + year, 0);
    date.setDate(dayOfYear);

    return date.toISOString().split('T')[0];
  };

  const isNearEarth = (mouseX: number, mouseY: number, earthX: number, earthY: number, radius: number = 20) => {
    const distance = Math.sqrt(Math.pow(mouseX - earthX, 2) + Math.pow(mouseY - earthY, 2));
    return distance <= radius;
  };

  const drawSolarSystem = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const orbitRadius = 60;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFD700';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#333';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const earthX = centerX + orbitRadius * Math.cos((earthRotation - 90) * Math.PI / 180);
    const earthY = centerY + orbitRadius * Math.sin((earthRotation - 90) * Math.PI / 180);

    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(earthX, earthY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(earthX - 2, earthY - 2, 3, 0, Math.PI * 2);
    ctx.arc(earthX + 3, earthY + 1, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    if (showSolarSystem) {
      drawSolarSystem();
    }
  }, [showSolarSystem, earthRotation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const orbitRadius = 60;

    const earthX = centerX + orbitRadius * Math.cos((earthRotation - 90) * Math.PI / 180);
    const earthY = centerY + orbitRadius * Math.sin((earthRotation - 90) * Math.PI / 180);

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    setIsHoveringEarth(isNearEarth(x * scaleX, y * scaleY, earthX, earthY));

    if (isDragging) {
      handleCanvasInteraction(e);
    }
  };

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const angle = Math.atan2(y - centerY, x - centerX);
    let degrees = (angle * 180 / Math.PI + 90 + 360) % 360;

    // Handle year transitions
    if (lastRotation > 270 && degrees < 90) {
      // Crossed from 359° to 0° (forward)
      setYearOffset(prev => prev + 1);
    } else if (lastRotation < 90 && degrees > 270) {
      // Crossed from 0° to 359° (backward)
      setYearOffset(prev => prev - 1);
    }

    setLastRotation(degrees);
    setEarthRotation(degrees);
    setBirthdate(calculateDateFromRotation(degrees, yearOffset));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            ← Back to Gallery
          </Button>
        </Link>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="birthdate">Your Birthday</Label>
            <Input
              id="birthdate"
              type="text"
              value={birthdate}
              placeholder="Click here to open solar system"
              onFocus={() => setShowSolarSystem(true)}
              readOnly
              className="cursor-pointer"
            />
          </div>

          {showSolarSystem && (
            <div className="mt-6 pt-8 px-6 pb-6 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg relative">
              <button
                onClick={() => setShowSolarSystem(false)}
                className="absolute top-2 right-2 text-white hover:text-gray-300 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className="w-full max-w-xs mx-auto"
                style={{ cursor: isDragging ? 'grabbing' : (isHoveringEarth ? 'grab' : 'default') }}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  handleCanvasInteraction(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => {
                  setIsDragging(true);
                  handleCanvasInteraction(e);
                }}
                onTouchMove={handleCanvasInteraction}
                onTouchEnd={() => setIsDragging(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}