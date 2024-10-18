'use client'
// components/ListenToArticle.js
import { useState } from 'react';

const ListenToArticle = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState(null);

  const handlePlayPause = () => {
    if (speech && isPlaying) {
      speech.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setSpeech(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div>
      <button onClick={handlePlayPause} className='listen-news' style={{border:'0px;'}}>
        {isPlaying ? 'Pause' : 'Start Listen'}
      </button>
    </div>
  );
};

export default ListenToArticle;
