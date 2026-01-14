import styles from './RewardsSystem.module.css';

const earningMethods = [
  { icon: '📝', title: 'Create Post', amount: '+10 Coins' },
  { icon: '💬', title: 'Comment', amount: '+5 Coins' },
  { icon: '🔄', title: 'Share', amount: '+3 Coins' },
  { icon: '❤️', title: 'Like', amount: '+1 Coin' },
];

export default function RewardsSystem() {
  return (
    <section className={styles.rewards} id="rewards">
      <div className="container">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.sectionBadge}>Snap Coins Rewards</div>
            <h2 className={styles.title}>
              Get Paid for Every Interaction
            </h2>
            <p className={styles.subtitle}>
              Stubgram rewards you with Snap Coins for everything you do. The more you engage, the more you earn. It's that simple.
            </p>
          </div>
          
          <div className={styles.content}>
            <div className={styles.earningGrid}>
              {earningMethods.map((method, index) => (
                <div key={index} className={styles.earningCard}>
                  <span className={styles.earningIcon}>{method.icon}</span>
                  <h3 className={styles.earningTitle}>{method.title}</h3>
                  <div className={styles.earningAmount}>{method.amount}</div>
                </div>
              ))}
            </div>
            
            <div className={styles.statsCard}>
              <h3 className={styles.statsTitle}>💰 Daily Earning Potential</h3>
              
              <div className={styles.stat}>
                <span className={styles.statLabel}>10 Posts</span>
                <span className={styles.statValue}>100 coins</span>
              </div>
              
              <div className={styles.stat}>
                <span className={styles.statLabel}>20 Comments</span>
                <span className={styles.statValue}>100 coins</span>
              </div>
              
              <div className={styles.stat}>
                <span className={styles.statLabel}>50 Likes</span>
                <span className={styles.statValue}>50 coins</span>
              </div>
              
              <div className={styles.stat}>
                <span className={styles.statLabel}>15 Shares</span>
                <span className={styles.statValue}>45 coins</span>
              </div>
              
              <div className={styles.total}>
                <span className={styles.totalLabel}>Daily Total</span>
                <span className={styles.totalValue}>295 Coins</span>
              </div>
              
              <p className={styles.note}>
                * Anti-fraud protection in place. Daily caps apply to ensure fair rewards for all users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
