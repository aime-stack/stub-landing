import styles from './Testimonials.module.css';

const stats = [
  { number: '85%', label: 'Feature Complete' },
  { number: '100K+', label: 'Posts Daily' },
  { number: '10M+', label: 'Coins Earned' },
  { number: '3', label: 'Platforms' },
];

const testimonials = [
  {
    quote: 'I\'ve earned over 5,000 coins just by being active! The celebrity chat feature is amazing. I actually got to talk to my favorite influencer.',
    author: 'Sarah M.',
    role: 'Content Creator',
    avatar: 'S',
  },
  {
    quote: 'Finally, a social platform that values my engagement. I\'ve already cashed out twice via mobile money. It\'s so easy!',
    author: 'James K.',
    role: 'Active User',
    avatar: 'J',
  },
  {
    quote: 'The course marketplace is a game-changer. I\'m learning new skills and the teachers are top-notch. Worth every coin!',
    author: 'Amina T.',
    role: 'Student',
    avatar: 'A',
  },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonials} id="testimonials">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionBadge}>Trusted by Thousands</div>
          <h2 className={styles.title}>
            Join a Thriving Community
          </h2>
        </div>
        
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <p className={styles.quote}>{testimonial.quote}</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{testimonial.avatar}</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{testimonial.author}</div>
                  <div className={styles.authorRole}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
