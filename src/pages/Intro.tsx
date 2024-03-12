import { useState } from 'react';
import styles from './Intro.module.css';

export default function Intro(): JSX.Element {
  const [showSignup, setShowSignup] = useState<boolean>(false);

  return (
    <div className={styles.intro}>
      <main className={styles.main}>
        <form className={styles.formLogin}>
          <input
            type='email'
            name='email'
            placeholder='Email'
            className={styles.input}
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            className={styles.input}
          />
          <button className={styles.btnLogin + ' btn-blue'}>Log In</button>
          <button className={styles.btnForgot}>Forgot password?</button>
        </form>
        <button
          onClick={() => setShowSignup(true)}
          className={styles.btnSignup + ' btn-green'}
        >
          Create new account
        </button>
      </main>

      {showSignup && (
        <div className={styles.signUp}>
          <header className={styles.signUpHeader}>
            <h2 className={styles.signUpTitle}>Sign Up</h2>
            <p className={styles.signUpSub}>It's quick and easy.</p>
          </header>
          <form className={styles.formSignUp}>
            <div className={styles.signUpName}>
              <input
                type='text'
                className={styles.signUpInputName}
                placeholder='First name'
              />
              <input
                type='text'
                className={styles.signUpInputName}
                placeholder='Last name'
              />
            </div>
            <input
              type='email'
              className={styles.input}
              placeholder='Email address'
            />
            <input
              type='password'
              className={styles.input}
              placeholder='Password'
            />
            <button className={styles.btnSignUp + ' btn-green'}>Sign Up</button>
          </form>
        </div>
      )}
    </div>
  );
}
