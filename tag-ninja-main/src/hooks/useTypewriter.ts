import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset when text changes
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
}