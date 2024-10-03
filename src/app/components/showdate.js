'use client'
import { useState, useEffect } from "react";

const ShowDate = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options); // Format: Monday, September 18, 2024
    
    setCurrentDate(formattedDate);
  }, []);

  return <div>{currentDate}</div>;
};

export default ShowDate;