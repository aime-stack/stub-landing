'use client';

import { useState } from 'react';
import { CreateReelModal } from './CreateReelModal';
import { Plus } from 'lucide-react';

export function ReelsActions() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-40 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-full text-white shadow-lg transition-all flex items-center justify-center hover:scale-105"
        title="Create Reel"
      >
        <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {showModal && <CreateReelModal onClose={() => setShowModal(false)} />}
    </>
  );
}
