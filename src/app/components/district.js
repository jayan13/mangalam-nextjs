'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getDistricts } from '@/lib/districts';

const District = () => {
  const router = useRouter();
  const [selectedUrl, setSelectedUrl] = useState('');
  const districts = getDistricts();

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
        {districts.map((district) => (
          <option key={district.id} value={`/district/${district.id}-${district.slug}.html`}>
            {district.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default District;
