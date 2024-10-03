
import News from '../components/news'
import BackButton from '../components/BackButton'
import { Metadata } from 'next';

export const metadata = {
    title: 'Mangalam News Paper',
    description: 'kerala malayalam new from mangalam',
  }

export default function Home() {
    return (
        <div className="home-news-container">
        <News />
        </div>
    );
}
