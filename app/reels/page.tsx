import { ReelsFeed } from '@/components/webapp/reels/ReelsFeed';
import { ReelsActions } from '@/components/webapp/reels/ReelsActions';
import { Metadata } from 'next';
import { getReels } from '@/services/posts';

export const metadata: Metadata = {
  title: 'Reels | Stubgram',
  description: 'Watch short, entertaining videos on Stubgram.',
};

export default async function ReelsPage() {
  const initialData = await getReels({ limit: 10 });
  
  return (
    <div className="bg-black w-full h-[calc(100vh-64px)] lg:h-screen lg:rounded-none relative overflow-hidden">
      <ReelsActions />
      <ReelsFeed reels={initialData.data} />
    </div>
  );
}
