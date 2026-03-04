'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Search, Plus, Heart, Phone, Star, X, Camera,
  MapPin, ChevronRight, ShoppingBag,
} from 'lucide-react';

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

/* ─── Mock Products ──────────────────────────────────────────────────────── */
const PRODUCTS = [
  /* Electronics */
  { id: 'p1',  category: 'Electronics', title: 'Premium Wireless Headphones',    price: 45000,  rating: 4.8, seller: 'TechStore KGL',  username: '@techstore_kgl', phone: '+250788100200', location: 'Kigali, RW', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=70' },
  { id: 'p2',  category: 'Electronics', title: 'Professional Camera Lens 50mm',  price: 195000, rating: 4.9, seller: 'PhotoHub RW',    username: '@photohub_rw',  phone: '+250782334455', location: 'Kigali, RW', img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=70' },
  { id: 'p3',  category: 'Electronics', title: 'iPhone 15 Pro — 256GB',           price: 1350000,rating: 4.9, seller: 'iZone Kigali',   username: '@izone_kgl',    phone: '+250788901122', location: 'Nyarugenge', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=70' },
  { id: 'p4',  category: 'Electronics', title: 'Samsung 4K Smart TV 55"',        price: 680000, rating: 4.7, seller: 'ElectroRW',      username: '@electro_rw',   phone: '+250789654321', location: 'Remera',     img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=70' },

  /* Fashion */
  { id: 'p5',  category: 'Fashion', title: 'Handmade Leather Bag',            price: 28000,  rating: 4.9, seller: 'KigeliCrafts',  username: '@kigeli_crafts', phone: '+250787112233', location: 'Nyamirambo', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=70' },
  { id: 'p6',  category: 'Fashion', title: 'African Print Dress Collection',  price: 12000,  rating: 4.7, seller: 'Amara Diallo',   username: '@amara.glow',    phone: '+250788445566', location: 'Kimironko',  img: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&q=70' },
  { id: 'p7',  category: 'Fashion', title: 'Men\'s Leather Sneakers',        price: 35000,  rating: 4.6, seller: 'UrbanStep RW',   username: '@urbanstep_rw',  phone: '+250783221100', location: 'Kacyiru',    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=70' },
  { id: 'p8',  category: 'Fashion', title: 'Ankara Ankara Suit (Custom)',    price: 55000,  rating: 4.8, seller: 'NaijaTailor',   username: '@naija_tailor',  phone: '+250788007654', location: 'Kigali, RW', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70' },

  /* Beauty */
  { id: 'p9',  category: 'Beauty', title: 'Organic Skincare Set (5pcs)',      price: 22000,  rating: 4.6, seller: 'NaturalGlow RW', username: '@naturalglow_rw', phone: '+250787765432', location: 'Kigali, RW', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=70' },
  { id: 'p10', category: 'Beauty', title: 'Luxury Perfume Collection',        price: 48000,  rating: 4.8, seller: 'ScentHouse KGL', username: '@scenthouse',     phone: '+250788123456', location: 'Nyarugenge', img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=70' },
  { id: 'p11', category: 'Beauty', title: 'Natural Hair Growth Oil',          price: 8500,   rating: 4.5, seller: 'Amara Diallo',   username: '@amara.glow',     phone: '+250788445566', location: 'Kimironko',  img: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=70' },
  { id: 'p12', category: 'Beauty', title: 'Makeup Starter Kit',               price: 31000,  rating: 4.7, seller: 'GlamUp RW',     username: '@glamup_rw',      phone: '+250789001122', location: 'Kicukiro',   img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=70' },

  /* Sports */
  { id: 'p13', category: 'Sports', title: 'Fitness Resistance Band Set',      price: 8500,   rating: 4.6, seller: 'Marcus Reid',    username: '@marcus.fit',     phone: '+250787334455', location: 'Kigali, RW', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=70' },
  { id: 'p14', category: 'Sports', title: 'Professional Football (Size 5)',   price: 18000,  rating: 4.8, seller: 'SportZone RW',   username: '@sportzone_rw',   phone: '+250788990011', location: 'Remera',     img: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=70' },
  { id: 'p15', category: 'Sports', title: 'Running Shoes (Nike Air Max)',     price: 120000, rating: 4.9, seller: 'SneakerHub',     username: '@sneakerhub_rw',  phone: '+250783556677', location: 'Kacyiru',    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=70' },
  { id: 'p16', category: 'Sports', title: 'Yoga Mat Premium (Non-slip)',      price: 15000,  rating: 4.7, seller: 'YogaRW',         username: '@yoga_rw',        phone: '+250789112233', location: 'Kimironko',  img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=70' },

  /* Food */
  { id: 'p17', category: 'Food', title: 'Fresh Organic Honey (1kg)',          price: 7500,   rating: 4.9, seller: 'HiveFarm RW',    username: '@hivefarm_rw',    phone: '+250787223344', location: 'Musanze',    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=70' },
  { id: 'p18', category: 'Food', title: 'Homemade Rwandan Isombe',            price: 3500,   rating: 4.7, seller: 'MamaKitchen',    username: '@mama_kitchen',   phone: '+250788667788', location: 'Nyamirambo', img: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=70' },
  { id: 'p19', category: 'Food', title: 'Freshly Roasted Coffee (500g)',      price: 6000,   rating: 4.8, seller: 'Gorilla Coffee',  username: '@gorilla_coffee', phone: '+250783778899', location: 'Kigali, RW', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=70' },
  { id: 'p20', category: 'Food', title: 'Avocado Box (12 pcs)',               price: 4000,   rating: 4.6, seller: 'FarmFirst RW',   username: '@farmfirst_rw',   phone: '+250788334455', location: 'Rwamagana',  img: 'https://images.unsplash.com/photo-1519905905-0fb8a87f9bfb?w=400&q=70' },

  /* Vehicles */
  { id: 'p21', category: 'Vehicles', title: 'Toyota RAV4 2020 — Low KMs',    price: 22500000,rating:4.8, seller: 'AutoGen RW',     username: '@autogen_rw',     phone: '+250788445500', location: 'Kigali, RW', img: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&q=70' },
  { id: 'p22', category: 'Vehicles', title: 'Honda CB150R Motorbike',         price: 3800000, rating:4.7, seller: 'MotoHub RW',     username: '@motohub_rw',     phone: '+250789556600', location: 'Nyarugenge', img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=70' },
  { id: 'p23', category: 'Vehicles', title: 'Bicycle (Mountain Trek 3000)',   price: 450000,  rating:4.6, seller: 'CycleRW',        username: '@cycle_rw',       phone: '+250787665544', location: 'Kacyiru',    img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=70' },
  { id: 'p24', category: 'Vehicles', title: 'VW Golf GTI 2019 Full Option',  price: 18900000,rating:4.9, seller: 'PremiumAutos',   username: '@premium_autos',  phone: '+250783667788', location: 'Kigali, RW', img: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=400&q=70' },

  /* Property */
  { id: 'p25', category: 'Property', title: '3-Bedroom Villa — Kacyiru',      price: 85000000,rating:4.9, seller: 'EstatePro RW',   username: '@estatepro_rw',   phone: '+250788009900', location: 'Kacyiru',    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70' },
  { id: 'p26', category: 'Property', title: 'Studio Apartment for Rent',      price: 250000,  rating:4.6, seller: 'RentRW',         username: '@rent_rw',        phone: '+250782334400', location: 'Remera',     img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=70' },
  { id: 'p27', category: 'Property', title: 'Land 5 Acres — Musanze',         price: 12000000,rating:4.7, seller: 'LandFirst RW',   username: '@landfirst_rw',   phone: '+250789445566', location: 'Musanze',     img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70' },
  { id: 'p28', category: 'Property', title: 'Commercial Space — CBD',         price: 1500000, rating:4.8, seller: 'CommercePro',    username: '@commercepro_rw', phone: '+250788112233', location: 'Nyarugenge', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70' },
];

type Product = typeof PRODUCTS[0];

/* ─── Add Product Modal ──────────────────────────────────────────────────── */
function AddProductModal({ onClose }: { onClose: () => void }) {
  const [title,    setTitle]    = useState('');
  const [price,    setPrice]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [category, setCategory] = useState('');
  const [desc,     setDesc]     = useState('');
  const [location, setLocation] = useState('');
  const [done,     setDone]     = useState(false);

  const valid = title.trim() && price.trim() && phone.trim() && category;

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
          {/* Photo upload */}
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

          <button onClick={() => valid && setDone(true)} disabled={!valid} style={{
            width: '100%', height: 48, borderRadius: 999, border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
            background: valid ? 'linear-gradient(135deg,#0a7ea4,#EC4899)' : '#F3F4F6',
            color: valid ? 'white' : '#D1D5DB',
            fontFamily: FONT, fontSize: 15, fontWeight: 700,
            boxShadow: valid ? '0 4px 16px rgba(10,126,164,0.25)' : 'none',
            transition: 'all 0.15s',
          }}>
            List Product 🛍️
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Card ────────────────────────────────────────────────────────── */
function ProductCard({ p }: { p: Product }) {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.15s, transform 0.15s', cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.10)'); (e.currentTarget.style.transform = 'translateY(-2px)'); }}
      onMouseLeave={e => { (e.currentTarget.style.boxShadow = 'none');                          (e.currentTarget.style.transform = 'translateY(0)'); }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 170, background: '#F3F4F6' }}>
        <Image src={p.img} alt={p.title} fill style={{ objectFit: 'cover' }} unoptimized />
        {/* Save button */}
        <button onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
          <Heart style={{ width: 15, height: 15, color: saved ? '#EC4899' : '#9CA3AF', fill: saved ? '#EC4899' : 'none', transition: 'all 0.15s' }} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{p.title}</p>

        {/* Price */}
        <p style={{ margin: 0, fontFamily: FONT, fontSize: 16, fontWeight: 800, color: '#EC4899' }}>{rwf(p.price)}</p>

        {/* Rating + location */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star style={{ width: 12, height: 12, color: '#F59E0B', fill: '#F59E0B' }} />
            <span style={{ fontFamily: FONT, fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{p.rating}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin style={{ width: 11, height: 11, color: '#9CA3AF' }} />
            <span style={{ fontFamily: FONT, fontSize: 11, color: '#9CA3AF' }}>{p.location}</span>
          </div>
        </div>

        {/* Seller info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0 0', borderTop: '1px solid #F3F4F6' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.pravatar.cc/28?u=${p.id}`} alt={p.seller} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: FONT, fontSize: 12, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.seller}</p>
            <p style={{ margin: 0, fontFamily: FONT, fontSize: 10, color: '#0a7ea4', fontWeight: 600 }}>{p.username}</p>
          </div>
        </div>

        {/* Call button */}
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
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function MarketplacePage() {
  const [category,   setCategory]   = useState<Category>('All');
  const [search,     setSearch]     = useState('');
  const [showAdd,    setShowAdd]    = useState(false);

  const filtered = PRODUCTS.filter(p => {
    const matchCat  = category === 'All' || p.category === category;
    const matchSrch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                      p.seller.toLowerCase().includes(search.toLowerCase()) ||
                      p.username.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

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

        {/* Results count */}
        <p style={{ fontFamily: FONT, fontSize: 13, color: '#9CA3AF', margin: '0 0 14px' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} {category !== 'All' ? `in ${category}` : 'available'}
        </p>

        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>No products found</p>
            <p style={{ fontFamily: FONT, fontSize: 14, color: '#9CA3AF', margin: 0 }}>Try a different category or search term.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {filtered.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>

      {/* ── Add product modal ────────────────────────────────────────────── */}
      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
