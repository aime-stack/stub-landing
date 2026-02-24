import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.container}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Image 
                src="/logo.png" 
                alt="Stubgram Logo" 
                width={48} 
                height={48}
                className={styles.logoImage}
              />
              <span className={styles.logoText}>Stubgram</span>
            </div>
            <p className={styles.tagline}>
              The social platform that pays you for being social. Earn while you connect.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>📘</a>
              <a href="#" className={styles.socialLink}>🐦</a>
              <a href="#" className={styles.socialLink}>📸</a>
              <a href="#" className={styles.socialLink}>💼</a>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4>Product</h4>
            <div className={styles.links}>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#rewards">Rewards</a>
              <a href="#showcase">Platform</a>
              <a href="#">Pricing</a>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4>Company</h4>
            <div className={styles.links}>
              <a href="#">About Us</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Press Kit</a>
              <a href="#">Contact</a>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4>Stay Updated</h4>
            <div className={styles.newsletter}>
              <p>Get the latest updates and offers.</p>
              <form className={styles.newsletterForm}>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterButton}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4>Contact Us</h4>
            <div className={styles.contactInfo}>
              <p>Phone: +250788463034</p>
              <p>Email: <a href="mailto:amahoro1212@gmail.com">amahoro1212@gmail.com</a></p>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © 2026 Stubgram. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
