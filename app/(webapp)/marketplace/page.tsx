'use client';

import { ShoppingBag, Search, Star, Heart } from 'lucide-react';
import { useState } from 'react';

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Premium Wireless Headphones', price: 45000, seller: 'TechStore KGL', avatar: '34', rating: 4.8, likes: 234, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80', category: 'Electronics' },
  { id: 'p2', name: 'Handmade Leather Bag', price: 28000, seller: 'KigeliCrafts', avatar: '35', rating: 4.9, likes: 189, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80', category: 'Fashion' },
  { id: 'p3', name: 'African Print Dress Collection', price: 12000, seller: 'Amara Diallo', avatar: '45', rating: 4.7, likes: 312, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', category: 'Fashion' },
  { id: 'p4', name: 'Organic Skincare Set (5pcs)', price: 22000, seller: 'NaturalGlow RW', avatar: '56', rating: 4.6, likes: 98, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80', category: 'Beauty' },
  { id: 'p5', name: 'Professional Camera Lens 50mm', price: 195000, seller: 'Jake Thornton', avatar: '8', rating: 5.0, likes: 67, img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=80', category: 'Electronics' },
  { id: 'p6', name: 'Fitness Resistance Band Set', price: 8500, seller: 'FitRwanda', avatar: '37', rating: 4.5, likes: 145, img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80', category: 'Sports' },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Beauty', 'Sports', 'Food'];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const products = MOCK_PRODUCTS.filter(p => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const formatPrice = (p: number) => `RWF ${p.toLocaleString()}`;

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="sticky top-0 z-10 px-4 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--divider)' }}>
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-5 h-5" style={{ color: '#E91E63' }} />
          <h1 className="text-[20px] font-bold" style={{ color: 'var(--text)', fontSize: '20px' }}>Marketplace</h1>
          <button className="ml-auto px-4 py-1.5 rounded-full text-[12px] font-bold text-white" style={{ background: '#E91E63' }}>+ Sell</button>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="w-full h-10 pl-11 pr-4 rounded-full text-[14px] outline-none" style={{ background: 'var(--divider)', color: 'var(--text)' }} />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className="px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all" style={activeCategory === cat ? { background: '#E91E63', color: 'white' } : { background: 'var(--divider)', color: 'var(--text-secondary)' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {products.map(p => {
          const isLiked = liked.has(p.id);
          return (
            <div key={p.id} className="rounded-2xl overflow-hidden transition-all hover:shadow-md cursor-pointer" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="relative h-36 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => setLiked(prev => { const n = new Set(prev); if (n.has(p.id)) n.delete(p.id); else n.add(p.id); return n; })}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                >
                  <Heart className="w-4 h-4" style={{ color: isLiked ? '#FF3B30' : 'var(--text-secondary)', fill: isLiked ? '#FF3B30' : 'transparent' }} />
                </button>
              </div>
              <div className="p-3">
                <p className="text-[13px] font-bold leading-tight mb-1 line-clamp-2" style={{ color: 'var(--text)' }}>{p.name}</p>
                <p className="text-[12px] font-bold mb-1" style={{ color: '#E91E63' }}>{formatPrice(p.price)}</p>
                <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  <Star className="w-3 h-3 fill-current" style={{ color: '#FFD700' }} />
                  <span>{p.rating}</span>
                  <span>· {p.seller}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
