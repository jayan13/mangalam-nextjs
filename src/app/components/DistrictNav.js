'use client'
import Link from 'next/link';
import { getDistricts } from '@/lib/districts';

const DistrictNav = () => {
    const districts = getDistricts();

    if (!districts || districts.length === 0) return null;

    return (
        <div className="category-sublinks">
            <ul>
                {districts.map((district) => (
                    <li key={district.id}>
                        <Link href={`/district/${district.id}-${district.slug}.html`}>
                            {district.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DistrictNav;
