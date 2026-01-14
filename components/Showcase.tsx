import Image from 'next/image';
import styles from './Showcase.module.css';

const screenshots = [
  {
    src: '/feed-screenshot.png',
    title: 'Social Feed',
    description: 'Beautiful, engaging feed with posts, stories, and real-time updates.',
  },
  {
    src: '/chat-screenshot.png',
    title: 'Celebrity Chat',
    description: 'Direct messaging with verified celebrities and influencers.',
  },
  {
    src: '/wallet-screenshot.png',
    title: 'Snap Coins Wallet',
    description: 'Track your earnings, spending history, and redeem rewards.',
  },
];

export default function Showcase() {
  return (
    <section className={styles.showcase} id="showcase">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionBadge}>Platform</div>
          <h2 className={styles.title}>
            Built for Every Device
          </h2>
          <p className={styles.subtitle}>
            Stubgram works seamlessly across iOS, Android, and Web. Take your social experience anywhere.
          </p>
        </div>
        
        <div className={styles.grid}>
          {screenshots.map((screenshot, index) => (
            <div key={index} className={styles.item}>
              <Image
                src={screenshot.src}
                alt={screenshot.title}
                width={300}
                height={600}
                className={styles.mockup}
              />
              <h3 className={styles.itemTitle}>{screenshot.title}</h3>
              <p className={styles.itemDescription}>{screenshot.description}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.platformBadges}>
          <div className={`${styles.badge} ${styles.iosBadge}`}>
            Available on iOS
          </div>
          <div className={`${styles.badge} ${styles.androidBadge}`}>
            Available on Android
          </div>
          <div className={`${styles.badge} ${styles.webBadge}`}>
            Web App (PWA)
          </div>
        </div>
      </div>
    </section>
  );
}
