"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function PhoneSlider() {
  const [phoneValue, setPhoneValue] = useState(55555555555);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [angle, setAngle] = useState(0);
  const [speed, setSpeed] = useState(0);
  const speedRef = useRef(0);
  const valueRef = useRef(55555555555);
  const animationRef = useRef<number>();

  const MIN_VALUE = 10000000000;
  const MAX_VALUE = 99999999999;
  const FRICTION = 0.99;

  // Format phone number for display
  const formatPhoneNumber = (value: number) => {
    const str = value.toString();
    return `(${str.substring(0, 2)}) ${str.substring(2, 5)}-${str.substring(5, 8)}-${str.substring(8, 11)}`;
  };

  // Physics update function
  const updatePhysics = () => {
    if (advancedMode && angle !== 0) {
      // Update speed based on angle
      speedRef.current += Math.sin((angle * Math.PI) / 180) * 1000;
      // Apply friction
      speedRef.current *= FRICTION;
      // Update value
      valueRef.current += Math.round(speedRef.current * 100000);

      // Bounce off edges
      if (valueRef.current > MAX_VALUE) {
        valueRef.current = MAX_VALUE;
        speedRef.current *= -1;
      } else if (valueRef.current < MIN_VALUE) {
        valueRef.current = MIN_VALUE;
        speedRef.current *= -1;
      }

      setPhoneValue(valueRef.current);
    }
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updatePhysics();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (advancedMode) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [advancedMode, angle]);

  const handleSliderChange = (value: number[]) => {
    setPhoneValue(value[0]);
    valueRef.current = value[0];
    speedRef.current = 0; // Reset speed when manually changing
  };

  const handleAngleChange = (value: number[]) => {
    setAngle(value[0]);
  };

  const handleAdvancedModeToggle = () => {
    setAdvancedMode(!advancedMode);
    if (!advancedMode) {
      // Reset when turning off advanced mode
      setAngle(0);
      speedRef.current = 0;
    }
  };

  const handleSubmit = () => {
    const phoneDisplay = formatPhoneNumber(phoneValue);
    if (window.confirm(`Is this your Phone Number?\n${phoneDisplay}`)) {
      alert("Thank you for your submission!");
    } else {
      alert(`Please contact your phone administrator to change your phone number to ${phoneDisplay}`);
    }
  };


  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            ← Back to Gallery
          </Button>
        </Link>

        <div className="space-y-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Phone:</Label>
              <span className="text-lg font-mono">{formatPhoneNumber(phoneValue)}</span>
            </div>

            <div
              style={{
                transform: advancedMode ? `rotate(${angle}deg)` : 'rotate(0deg)',
                transition: !advancedMode ? 'transform 0.5s ease-in-out' : 'none',
              }}
            >
              <Slider
                value={[phoneValue]}
                onValueChange={handleSliderChange}
                min={MIN_VALUE}
                max={MAX_VALUE}
                step={1}
                className="w-full"
                title="Hint: use keyboard arrows to change value"
              />
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="advancedMode"
                checked={advancedMode}
                onChange={handleAdvancedModeToggle}
                className="w-4 h-4"
              />
              <Label htmlFor="advancedMode" className="cursor-pointer">
                Advanced Mode
              </Label>
            </div>

            {advancedMode && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="angleSlider">Angle: {angle.toFixed(2)}°</Label>
                  <Slider
                    id="angleSlider"
                    value={[angle]}
                    onValueChange={handleAngleChange}
                    min={-10}
                    max={10}
                    step={0.02}
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Speed: {Math.round(speedRef.current)}</p>
                  <p>Value: {phoneValue}</p>
                </div>
              </div>
            )}

            <Button onClick={handleSubmit} className="w-full">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}