import styles from './Features.module.css';

const features = [
  {
    icon: '💰',
    title: 'Snap Coins Rewards',
    description: 'Earn coins for every interaction. Create posts (+10), comment (+5), like (+1), and share (+3). Turn your social activity into real rewards.',
    highlight: true,
  },
  {
    icon: '💬',
    title: 'Celebrity Chat',
    description: 'Direct access to your favorite verified celebrities and influencers. Pay per message and get real responses from the people you admire.',
  },
  {
    icon: '🎓',
    title: 'Course Marketplace',
    description: 'Learn from experts and top creators. Purchase courses with coins or mobile money, track your progress, and earn certificates.',
  },
  {
    icon: '📱',
    title: 'Multiple Content Types',
    description: 'Share photos, videos, stories, reels, polls, links, and audio posts. Express yourself in unlimited ways.',
  },
  {
    icon: '💳',
    title: 'Mobile Money Integration',
    description: 'Easy deposits and withdrawals via MTN & Airtel mobile money. Powered by Flutterwave for fast, secure transactions across Africa.',
  },
  {
    icon: '📹',
    title: 'Real-Time Everything',
    description: 'WebSocket-powered instant messaging, typing indicators, live notifications, and video calls. Stay connected in real-time.',
  },
];

export default function Features() {
  return (
    <section className={styles.features} id="features">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionBadge}>Features</div>
          <h2 className={styles.title}>
            Everything You Need to<br />Thrive Online
          </h2>
          <p className={styles.description}>
            Stubgram combines the best of social media with innovative monetization features. Engage, earn, learn, and connect—all in one platform.
          </p>
        </div>
        
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${styles.card} ${feature.highlight ? styles.highlight : ''}`}
            >
              <span className={styles.icon}>{feature.icon}</span>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
