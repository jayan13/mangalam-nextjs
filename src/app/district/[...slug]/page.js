

import BackButton from '../../components/BackButton'

export default function Home({params}) {
    const urlid= params.slug[0];
    const district_id= urlid.split('-')[0];
    return (
        <div className='article'>
            <BackButton />
            District
        </div>
    );
}
