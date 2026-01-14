import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.container}>
          <h2 className={styles.title}>
            Ready to Start Earning?
          </h2>
          <p className={styles.subtitle}>
            Join 100,000+ users who are already getting paid for their social engagement. Sign up free today—no credit card required.
          </p>
          
          <div className={styles.buttons}>
            <button className={styles.btnPrimary}>
              Get Started Free
            </button>
            <button className={styles.btnSecondary}>
              Download App
            </button>
          </div>
          
          <ul className={styles.features}>
            <li>✨ 100% Free Forever</li>
            <li>💰 Start Earning Immediately</li>
            <li>🚀 No Setup Fees</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
