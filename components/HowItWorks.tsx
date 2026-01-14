import styles from './HowItWorks.module.css';

const steps = [
  {
    number: 1,
    icon: '🚀',
    title: 'Sign Up',
    description: 'Create your free account in seconds. No credit card required.',
  },
  {
    number: 2,
    icon: '💬',
    title: 'Engage',
    description: 'Post, like, comment, share, and connect with your favorite people.',
  },
  {
    number: 3,
    icon: '💰',
    title: 'Earn Coins',
    description: 'Get rewarded with Snap Coins for every action you take on the platform.',
  },
  {
    number: 4,
    icon: '🎉',
    title: 'Redeem',
    description: 'Spend coins on boosts, courses, celebrity chat, or cash out via mobile money.',
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.howItWorks} id="how-it-works">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionBadge}>How It Works</div>
          <h2 className={styles.title}>
            Start Earning in 4 Simple Steps
          </h2>
        </div>
        
        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <span className={styles.icon}>{step.icon}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
