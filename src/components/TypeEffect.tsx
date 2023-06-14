import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string | string[];
  speed: number;
}

export const TypeEffect: React.FC<TypewriterProps> = ({ text, speed }) => {
  const [outputText, setOutputText] = useState('');
  const [counter, setCounter] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentText = Array.isArray(text) ? text[currentIndex] : text;

  useEffect(() => {
    if (counter < currentText.length) {
      const timerId = setTimeout(() => {
        setOutputText((prevText) => prevText + currentText[counter]);
        setCounter((prevCounter) => prevCounter + 1);
      }, speed);
      return () => clearTimeout(timerId);
    } else {
      const timerId = setTimeout(() => {
        setOutputText('');
        setCounter(0);
        if (Array.isArray(text)) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % text.length);
        }
      }, speed);
      return () => clearTimeout(timerId);
    }
  }, [counter, currentText, speed, text]);

  return <span>{outputText}</span>;
};
