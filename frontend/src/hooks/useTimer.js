import { useState, useEffect } from "react";

function useTimer(initialTime, callback) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (callback) callback(); // Call the callback when timer hits zero
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, callback]);

  return [timeLeft, setTimeLeft];
}

export default useTimer;
