'use client'
// components/ListenToArticle.js
import { useState } from 'react';

const ListenToArticle = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState(null);

  const handlePlayPause = () => {
    if (speech && isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setSpeech(utterance);
      setIsPlaying(true);
    }
  };
  if(text){
    return (
    <div>
      <button onClick={handlePlayPause} className='listen-news' style={{border:'0px;'}}>
        {isPlaying ? 'II Pause' : '▶ Start Listen'}
      </button>
    </div>
      );
    }else{
      return ('');
    }
};

export default ListenToArticle;
