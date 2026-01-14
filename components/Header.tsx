'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import SignupModal from './SignupModal';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#rewards', label: 'Rewards' },
  { href: '#showcase', label: 'Platform' },
  { href: '#testimonials', label: 'Reviews' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="#" className={styles.logo} onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          <Image 
            src="/logo.png" 
            alt="Stubgram" 
            width={40} 
            height={40}
            className={styles.logoImage}
          />
          <span className={styles.logoText}>Stubgram</span>
        </a>
        
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={handleNavClick}
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        <button className={styles.ctaButton} onClick={() => setSignupModalOpen(true)}>
          Get Started
        </button>
        
        <button 
          className={`${styles.menuButton} ${mobileMenuOpen ? styles.open : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
        </button>
      </div>
      
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <nav className={styles.mobileNav}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={handleNavClick}
            >
              {link.label}
            </a>
          ))}
          <button className={styles.mobileCtaButton}>
            Get Started
          </button>
        </nav>
      </div>
      
      <SignupModal 
        isOpen={signupModalOpen} 
        onClose={() => setSignupModalOpen(false)} 
      />
    </header>
  );
}
