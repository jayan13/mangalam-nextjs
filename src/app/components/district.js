'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const District = () => {
  const router = useRouter();
  const [selectedUrl, setSelectedUrl] = useState('');

  const handleSelectChange = (e) => {
    const url = e.target.value;
    if (url) {
      router.push(url);  // Redirect to the selected URL
    }
  };

  return (
    <div>
      <select value={selectedUrl} id="district" className="select" onChange={handleSelectChange}>
        <option value="">Choose a District</option>
        <option value="/district/12-Thiruvananthapuram-India.html">Thiruvananthapuram</option>
		<option value="/district/6-Kollam-India.html">Kollam </option>
		<option value="/district/11-Pathanamthitta-India.html">Pathanamthitta</option>
		<option value="/district/1-Alappuzha-India.html">Alappuzha</option>
		<option value="/district/7-Kottayam-India.html">Kottayam</option>
		<option value="/district/3-Idukki-India.html">Idukki</option>
		<option value="/district/2-Ernakulam-India.html">Ernakulam</option>
		<option value="/district/13-Thrissur-India.html">Thrissur</option>
		<option value="/district/10-Palakkad-India.html">Palakkad </option>
		<option value="/district/9-Malappuram-India.html">Malappuram</option>
		<option value="/district/8-Kozhikode-India.html">Kozhikode</option>
        <option value="/district/14-Vayanad-India.html">Vayanad</option>
		<option value="/district/4-Kannur-India.html">Kannur</option>
		<option value="/district/5-Kasaragod-India.html">Kasaragod</option>
      </select>
    </div>
  );
};

export default District;
