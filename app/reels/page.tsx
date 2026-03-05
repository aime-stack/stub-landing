import { MOCK_REELS } from '@/services/mockData';
import { ReelsFeed } from '@/components/webapp/reels/ReelsFeed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reels | Stubgram',
  description: 'Watch short, entertaining videos on Stubgram.',
};

export default function ReelsPage() {
  return (
    <div className="bg-black w-full h-[calc(100vh-64px)] lg:h-screen lg:rounded-none relative overflow-hidden">
      <ReelsFeed reels={MOCK_REELS} />
    </div>
  );
}
