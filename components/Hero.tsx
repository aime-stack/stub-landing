import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.badge}>
              Join 100,000+ Active Users
            </div>
            
            <h1 className={styles.title}>
              Earn While You Connect
            </h1>
            
            <p className={styles.subtitle}>
              The first social platform that pays you for being social. Get rewarded with Snap Coins for every like, comment, and share. Turn your engagement into real money.
            </p>
            
            <div className={styles.ctaButtons}>
              <button className={styles.ctaPrimary}>
                Get Started Free
              </button>
              <button className={styles.ctaSecondary}>
                Watch Demo
              </button>
            </div>
            
            <div className={styles.socialProof}>
              100% Free • No Credit Card Required
            </div>
          </div>
          
          <div className={styles.mockupContainer}>
            <Image 
              src="/hero-mockup.png" 
              alt="Stubgram App Interface" 
              width={500} 
              height={400}
              className={styles.mockup}
              priority
            />
            <div className={`${styles.floatingCard} ${styles.coins}`}>
              💰 +10 Coins Earned
            </div>
            <div className={`${styles.floatingCard} ${styles.users}`}>
              🎉 10M+ Coins Earned
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
