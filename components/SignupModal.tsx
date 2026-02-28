'use client';

import { useState } from 'react';
import styles from './SignupModal.module.css';
import { signupAction } from '@/services/auth';

type UserType = 'user' | 'teacher' | 'celebrity' | 'company' | null;

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const userTypes = [
  {
    id: 'user' as UserType,
    icon: '👤',
    name: 'Regular User',
    description: 'Join, engage, and earn coins for every interaction',
  },
  {
    id: 'teacher' as UserType,
    icon: '🎓',
    name: 'Teacher',
    description: 'Create and sell courses, share your expertise',
  },
  {
    id: 'celebrity' as UserType,
    icon: '⭐',
    name: 'Celebrity',
    description: 'Connect with fans through paid messaging',
  },
  {
    id: 'company' as UserType,
    icon: '🏢',
    name: 'Company',
    description: 'Request business account access (requires approval)',
  },
];

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    message: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signupAction({
        accountType: selectedType,
        ...formData,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Will be redirected
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!selectedType || !formData.agreeToTerms) return false;
    
    if (selectedType === 'company') {
      return formData.fullName && formData.email && formData.companyName && formData.message;
    }
    
    return (
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.password === formData.confirmPassword
    );
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <div className={styles.header}>
          <h2 className={styles.title}>Join Stubgram</h2>
          <p className={styles.subtitle}>
            Start earning coins for every interaction
          </p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Select Account Type</h3>
            <div className={styles.userTypeGrid}>
              {userTypes.map((type) => (
                <div
                  key={type.id}
                  className={`${styles.userTypeCard} ${
                    selectedType === type.id ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <span className={styles.userTypeIcon}>{type.icon}</span>
                  <div className={styles.userTypeName}>{type.name}</div>
                  <p className={styles.userTypeDescription}>{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedType && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.step}>
                <h3 className={styles.stepTitle}>
                  {selectedType === 'company' ? 'Company Information' : 'Your Information'}
                </h3>

                {selectedType === 'company' && (
                  <div className={styles.companyNote}>
                    <p>
                      <strong>Note:</strong> Company accounts require admin approval. 
                      Please provide your details and we'll contact you within 24-48 hours.
                    </p>
                  </div>
                )}

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Full Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      className={styles.input}
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {selectedType === 'company' && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Company Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        className={styles.input}
                        placeholder="Acme Inc."
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Email <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={styles.input}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {selectedType !== 'company' && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Phone (Optional)</label>
                      <input
                        type="tel"
                        name="phone"
                        className={styles.input}
                        placeholder="+256 700 000 000"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>

                {selectedType === 'company' ? (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Message / Reason for Registration <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      name="message"
                      className={styles.textarea}
                      placeholder="Tell us about your company and why you'd like to join Stubgram..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ) : (
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Password <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        className={styles.input}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={8}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Confirm Password <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className={styles.input}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                )}

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeToTerms"
                    className={styles.checkbox}
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="terms" className={styles.checkboxLabel}>
                    I agree to the <a href="#">Terms of Service</a> and{' '}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div>

                {error && (
                  <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px', padding: '10px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!isFormValid() || loading}
                >
                  {loading ? 'Validating...' : selectedType === 'company' ? 'Submit Request' : 'Create Account'}
                </button>

                <div className={styles.signInLink}>
                  Already have an account? <a href="/login">Sign In</a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
