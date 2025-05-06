"use client";
import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, "0");
  };

  return (
    <div className="mb-10">
      <div className="mb-2 flex flex-wrap justify-center gap-2 text-title-md font-bold text-brand-500 dark:text-brand-400 xl:text-title-lg">
        <div className="timer-box">
          <span>{formatTime(timeLeft.days)}</span>
        </div>
        :
        <div className="timer-box">
          <span>{formatTime(timeLeft.hours)}</span>
        </div>
        :
        <div className="timer-box">
          <span>{formatTime(timeLeft.minutes)}</span>
        </div>
        :
        <div className="timer-box">
          <span>{formatTime(timeLeft.seconds)}</span>
        </div>
      </div>

      <div className="text-center text-base text-gray-500 dark:text-gray-400">
        <span className="timer-box inline-block">
          <span className="inline-block">{timeLeft.days}</span>
        </span>
        {timeLeft.days === 1 ? " day" : " days"} left
      </div>
    </div>
  );
};

export default CountdownTimer;
