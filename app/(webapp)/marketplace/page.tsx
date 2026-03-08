'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search, Plus, Heart, Phone, Star, X, Camera,
  MapPin, ChevronRight, ShoppingBag,
} from 'lucide-react';
import { ImageGallery } from '@/components/webapp/ui/ImageGallery';

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const rwf = (n: number) => `RWF ${n.toLocaleString('en-US')}`;

/* ─── Categories ─────────────────────────────────────────────────────────── */
type Category = 'All' | 'Electronics' | 'Fashion' | 'Beauty' | 'Sports' | 'Food' | 'Vehicles' | 'Property';

const CATEGORIES: { id: Category; emoji: string }[] = [
  { id: 'All',         emoji: '🛍️' },
  { id: 'Electronics', emoji: '📱' },
  { id: 'Fashion',     emoji: '👗' },
  { id: 'Beauty',      emoji: '💄' },
  { id: 'Sports',      emoji: '🏋️' },
  { id: 'Food',        emoji: '🍽️' },
  { id: 'Vehicles',    emoji: '🚗' },
  { id: 'Property',    emoji: '🏠' },
];


/* ─── Add Product Modal ──────────────────────────────────────────────────── */
function AddProductModal({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) {
  const [title,    setTitle]    = useState('');
  const [price,    setPrice]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [category, setCategory] = useState('');
  const [desc,     setDesc]     = useState('');
  const [location, setLocation] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: desc,
          price: parseInt(price),
          category,
          phone,
          location,
          image_url: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80` // Placeholder for now
        })
      });

      if (!res.ok) throw new Error('Failed to list product');
      
      setDone(true);
      onRefresh();
    } catch (err) {
      alert('Error listing product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const valid = title.trim() && price.trim() && phone.trim() && category && !loading;

  if (done) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '48px 32px', textAlign: 'center', maxWidth: 380, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
        <h2 style={{ margin: '0 0 8px', fontFamily: FONT, fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>Product Listed!</h2>
        <p style={{ margin: '0 0 24px', fontFamily: FONT, fontSize: 14, color: '#9CA3AF', lineHeight: 1.6 }}>
          <strong style={{ color: '#1A1A1A' }}>{title}</strong> is now live on the Marketplace.
        </p>
        <button onClick={onClose} style={{ width: '100%', height: 48, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#0a7ea4,#EC4899)', color: 'white', fontFamily: FONT, fontSize: 15, fontWeight: 700, boxShadow: '0 4px 16px rgba(10,126,164,0.25)' }}>
          Back to Marketplace
        </button>
      </div>
    </div>
  );

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #F3F4F6', zIndex: 1 }}>
          <h2 style={{ margin: 0, fontFamily: FONT, fontSize: 17, fontWeight: 800, color: '#1A1A1A' }}>Add a Product</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Photo upload placeholder */}
          <div style={{ height: 120, borderRadius: 16, background: 'linear-gradient(135deg,rgba(10,126,164,0.10),rgba(236,72,153,0.08))', border: '2px dashed rgba(10,126,164,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
            <Camera style={{ width: 28, height: 28, color: '#0a7ea4' }} />
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#0a7ea4' }}>Upload product photos</span>
            <span style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>JPG, PNG up to 10MB</span>
          </div>

          {/* Fields */}
          {[
            { label: 'Product Title *',    val: title,    set: setTitle,    ph: 'e.g. iPhone 15 Pro 256GB',     type: 'text'   },
            { label: 'Price (RWF) *',      val: price,    set: setPrice,    ph: 'e.g. 1350000',                 type: 'number' },
            { label: 'Phone Number *',     val: phone,    set: setPhone,    ph: '+250 7XX XXX XXX',             type: 'tel'    },
            { label: 'Location',           val: location, set: setLocation, ph: 'e.g. Kigali, Remera',          type: 'text'   },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} type={f.type}
                style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                onFocus={e => (e.currentTarget.style.border = '1.5px solid #0a7ea4')}
                onBlur={e => (e.currentTarget.style.border = '1.5px solid #E5E7EB')}
              />
            </div>
          ))}

          <div>
            <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 14, outline: 'none', background: 'white', boxSizing: 'border-box' }}>
              <option value="">Select category</option>
              {CATEGORIES.filter(c => c.id !== 'All').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.id}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe your product — condition, features, why you're selling..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontFamily: FONT, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
              onFocus={e => (e.currentTarget.style.border = '1.5px solid #0a7ea4')}
              onBlur={e => (e.currentTarget.style.border = '1.5px solid #E5E7EB')}
            />
          </div>

          <button onClick={handleSubmit} disabled={!valid} style={{
            width: '100%', height: 48, borderRadius: 999, border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
            background: valid ? 'linear-gradient(135deg,#0a7ea4,#EC4899)' : '#F3F4F6',
            color: valid ? 'white' : '#D1D5DB',
            fontFamily: FONT, fontSize: 15, fontWeight: 700,
            boxShadow: valid ? '0 4px 16px rgba(10,126,164,0.25)' : 'none',
            transition: 'all 0.15s',
          }}>
            {loading ? 'Processing...' : 'List Product 🛍️'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Card ────────────────────────────────────────────────────────── */
function ProductCard({ p, setActiveImage }: { p: any, setActiveImage: (img: string) => void }) {
  const [liked, setLiked] = useState(false);
  const imgUrl = p.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=70';
  
  return (
    <div
      style={{
        background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Image area */}
      <div
        style={{ position: 'relative', height: 200, cursor: 'zoom-in' }}
        onClick={(e) => { e.stopPropagation(); setActiveImage(imgUrl); }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* Save button */}
        <button onClick={e => { e.stopPropagation(); setLiked(s => !s); }}
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
          <Heart style={{ width: 15, height: 15, color: liked ? '#EC4899' : '#9CA3AF', fill: liked ? '#EC4899' : 'none', transition: 'all 0.15s' }} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{p.title}</p>

        {/* Price */}
        <p style={{ margin: 0, fontFamily: FONT, fontSize: 16, fontWeight: 800, color: '#EC4899' }}>{rwf(p.price)}</p>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <MapPin style={{ width: 11, height: 11, color: '#9CA3AF' }} />
          <span style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>{p.location || 'Kigali, RW'}</span>
        </div>

        {/* Seller info */}
        {p.seller && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0 0', borderTop: '1px solid #F3F4F6' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.seller.avatar_url || `https://i.pravatar.cc/28?u=${p.id}`} alt={p.seller.full_name} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: FONT, fontSize: 12, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.seller.full_name}</p>
              <p style={{ margin: 0, fontFamily: FONT, fontSize: 10, color: '#0a7ea4', fontWeight: 600 }}>@{p.seller.username}</p>
            </div>
          </div>
        )}

        {/* Call button */}
        {p.phone && (
          <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            height: 38, borderRadius: 999,
            background: 'linear-gradient(135deg,#0a7ea4,#EC4899)',
            color: 'white', textDecoration: 'none',
            fontFamily: FONT, fontSize: 13, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(10,126,164,0.22)',
            transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Phone style={{ width: 13, height: 13 }} /> Call Seller
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function MarketplacePage() {
  const [category,   setCategory]   = useState<Category>('All');
  const [search,     setSearch]     = useState('');
  const [products,   setProducts]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showAdd,    setShowAdd]    = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/marketplace?q=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: FONT }}>

      {/* ── Sticky top bar ──────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB',
      }}>
        {/* Title + CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag style={{ width: 18, height: 18, color: 'white' }} />
            </div>
            <h1 style={{ margin: 0, fontFamily: FONT, fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>Marketplace</h1>
          </div>
          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 36, paddingLeft: 16, paddingRight: 16, borderRadius: 999,
            border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#F59E0B,#EC4899)',
            color: 'white', fontFamily: FONT, fontSize: 13, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
            transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus style={{ width: 14, height: 14 }} /> Sell
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '0 20px 10px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 34, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#9CA3AF', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, sellers…"
            style={{ width: '100%', height: 44, paddingLeft: 42, paddingRight: 14, borderRadius: 999, border: '1.5px solid transparent', background: '#F3F4F6', fontFamily: FONT, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
            onFocus={e => { (e.currentTarget.style.background = 'white'); (e.currentTarget.style.border = '1.5px solid #0a7ea4'); (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,126,164,0.08)'); }}
            onBlur={e =>  { (e.currentTarget.style.background = '#F3F4F6'); (e.currentTarget.style.border = '1.5px solid transparent'); (e.currentTarget.style.boxShadow = 'none'); }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 12px', overflowX: 'auto' }} className="no-scrollbar">
          {CATEGORIES.map(({ id, emoji }) => {
            const active = category === id;
            return (
              <button key={id} onClick={() => setCategory(id)} style={{
                flexShrink: 0,
                height: 36, paddingLeft: 14, paddingRight: 14, borderRadius: 999,
                border: active ? 'none' : '1.5px solid #E5E7EB',
                background: active ? 'linear-gradient(135deg,#0a7ea4,#EC4899)' : 'white',
                color: active ? 'white' : '#6B7280',
                fontFamily: FONT, fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                boxShadow: active ? '0 2px 8px rgba(10,126,164,0.2)' : 'none',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 14 }}>{emoji}</span> {id}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Products grid ───────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px' }}>
        {loading && products.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {[1,2,3,4,5,6,7,8].map(n => (
              <div key={n} className="skeleton" style={{ height: 320, borderRadius: 16 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>No products found</p>
            <p style={{ fontFamily: FONT, fontSize: 14, color: '#9CA3AF', margin: 0 }}>Try a different category or search term.</p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: FONT, fontSize: 13, color: '#9CA3AF', margin: '0 0 14px' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} {category !== 'All' ? `in ${category}` : 'available'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {products.map(p => <ProductCard key={p.id} p={p} setActiveImage={setActiveImage} />)}
            </div>
          </>
        )}
      </div>

      {/* ── Add product modal ────────────────────────────────────────────── */}
      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onRefresh={fetchProducts} />}
      
      {activeImage && (
        <ImageGallery
          images={[activeImage]}
          initialIndex={0}
          onClose={() => setActiveImage(null)}
        />
      )}
    </div>
  );
}
