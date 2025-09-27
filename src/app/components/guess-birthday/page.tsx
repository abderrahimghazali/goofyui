"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GuessBirthday() {
  const [currentGuess, setCurrentGuess] = useState("");
  const [minDate, setMinDate] = useState(new Date(1900, 0, 1));
  const [maxDate, setMaxDate] = useState(new Date());
  const [guessCount, setGuessCount] = useState(0);
  const [isGuessing, setIsGuessing] = useState(false);
  const [foundDate, setFoundDate] = useState("");

  const getMidDate = (min: Date, max: Date) => {
    const midTime = (min.getTime() + max.getTime()) / 2;
    return new Date(midTime);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const startGuessing = () => {
    setIsGuessing(true);
    setGuessCount(0);
    setFoundDate("");
    setMinDate(new Date(1900, 0, 1));
    setMaxDate(new Date());
    const mid = getMidDate(new Date(1900, 0, 1), new Date());
    setCurrentGuess(formatDate(mid));
  };

  const handleEarlier = () => {
    const currentDate = new Date(currentGuess);
    setMaxDate(new Date(currentDate.getTime() - 86400000)); // Previous day
    setGuessCount(prev => prev + 1);

    const newMin = minDate;
    const newMax = new Date(currentDate.getTime() - 86400000);

    if (newMin.getTime() === newMax.getTime()) {
      setFoundDate(formatDate(newMin));
      setCurrentGuess(formatDate(newMin));
      setIsGuessing(false);
    } else if (newMin.getTime() > newMax.getTime()) {
      setFoundDate(formatDate(newMax));
      setCurrentGuess(formatDate(newMax));
      setIsGuessing(false);
    } else {
      const mid = getMidDate(newMin, newMax);
      setCurrentGuess(formatDate(mid));
    }
  };

  const handleLater = () => {
    const currentDate = new Date(currentGuess);
    setMinDate(new Date(currentDate.getTime() + 86400000)); // Next day
    setGuessCount(prev => prev + 1);

    const newMin = new Date(currentDate.getTime() + 86400000);
    const newMax = maxDate;

    if (newMin.getTime() === newMax.getTime()) {
      setFoundDate(formatDate(newMin));
      setCurrentGuess(formatDate(newMin));
      setIsGuessing(false);
    } else if (newMin.getTime() > newMax.getTime()) {
      setFoundDate(formatDate(newMax));
      setCurrentGuess(formatDate(newMax));
      setIsGuessing(false);
    } else {
      const mid = getMidDate(newMin, newMax);
      setCurrentGuess(formatDate(mid));
    }
  };

  const handleCorrect = () => {
    setFoundDate(currentGuess);
    setIsGuessing(false);
  };

  const reset = () => {
    setCurrentGuess("");
    setMinDate(new Date(1900, 0, 1));
    setMaxDate(new Date());
    setGuessCount(0);
    setIsGuessing(false);
    setFoundDate("");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            ← Back to Gallery
          </Button>
        </Link>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="birthday">Your Birthday</Label>
            <div className="flex items-center gap-4">
              {isGuessing && (
                <Button onClick={handleEarlier} variant="outline">
                  Earlier
                </Button>
              )}

              <Input
                id="birthday"
                type="text"
                value={foundDate || currentGuess}
                placeholder="Click here to start guessing"
                onClick={!isGuessing && !foundDate ? startGuessing : undefined}
                readOnly
                className="cursor-pointer text-center"
              />

              {isGuessing && (
                <Button onClick={handleLater} variant="outline">
                  Later
                </Button>
              )}
            </div>
          </div>

          {isGuessing && (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Is your birthday {formatDisplayDate(new Date(currentGuess))}?
              </p>
              <Button onClick={handleCorrect} variant="default" size="sm">
                Yes, that's correct!
              </Button>
              <p className="text-sm text-gray-500">
                Guesses: {guessCount}
              </p>
            </div>
          )}

          {foundDate && !isGuessing && (
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                Found your birthday!
              </p>
              <p className="text-sm">
                {formatDisplayDate(new Date(foundDate))}
              </p>
              <p className="text-sm text-gray-500">
                Total guesses: {guessCount}
              </p>
              <Button onClick={reset} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          )}

          {!isGuessing && !foundDate && guessCount === 0 && (
            <p className="text-center text-sm text-gray-500">
              Click the input field to start the birthday guessing game
            </p>
          )}
        </div>
      </div>
    </div>
  );
}