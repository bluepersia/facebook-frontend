import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import styles from './Intro.module.css';
import useFetch from '../hooks/useFetch';
import { apiUrl } from '../util/url';
import { AppContext } from '../App';
import { IUser } from '../models/user';
import { useNavigate } from 'react-router-dom';

type LoginForm = {
  email: string;
  password: string;
};

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type LoginFetch = {
  data: {
    user: IUser;
  };
};

export default function Intro(): JSX.Element {
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const loginFetch = useFetch<LoginFetch>();
  const signupFetch = useFetch<LoginFetch>();
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginFetch.data) {
      setUser(loginFetch.data.data.user);
      navigate('/');
    }
  }, [loginFetch.data]);

  useEffect(() => {
    if (signupFetch.data) {
      setUser(signupFetch.data.data.user);
      setShowSignup(false);
      navigate('/');
    }
  }, [signupFetch.data]);

  function handleLoginInputChange(e: ChangeEvent): void {
    const { name, value } = e.target as HTMLInputElement;

    setLoginForm((loginForm) => ({ ...loginForm, [name]: value }));
  }

  function handleSignupInputChange(e: ChangeEvent): void {
    const { name, value } = e.target as HTMLInputElement;

    setSignupForm((signupForm) => ({ ...signupForm, [name]: value }));
  }

  function handleLoginSubmit(e: FormEvent): void {
    e.preventDefault();
    loginFetch.refetch(`${apiUrl}/users/login`, {
      method: 'POST',
      body: new FormData(e.target as HTMLFormElement),
      credentials: 'include',
    });
  }

  function handleSignupSubmit(e: FormEvent): void {
    e.preventDefault();
    signupFetch.refetch(`${apiUrl}/users/sign-up`, {
      method: 'POST',
      body: new FormData(e.target as HTMLFormElement),
      credentials: 'include',
    });
  }

  return (
    <div className={styles.intro}>
      <main className={styles.main}>
        <form className={styles.formLogin} onSubmit={handleLoginSubmit}>
          <input
            type='email'
            name='email'
            placeholder='Email'
            className={styles.input}
            value={loginForm.email}
            onChange={handleLoginInputChange}
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            className={styles.input}
            value={loginForm.password}
            onChange={handleLoginInputChange}
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
        {loginFetch.error && (
          <p className='error'>{loginFetch.error.message}</p>
        )}
      </main>

      {showSignup && (
        <div className={styles.signUp}>
          <header className={styles.signUpHeader}>
            <h2 className={styles.signUpTitle}>Sign Up</h2>
            <p className={styles.signUpSub}>It's quick and easy.</p>
          </header>
          <form className={styles.formSignUp} onSubmit={handleSignupSubmit}>
            <div className={styles.signUpName}>
              <input
                type='text'
                className={styles.signUpInputName}
                placeholder='First name'
                name='firstName'
                value={signupForm.firstName}
                onChange={handleSignupInputChange}
              />
              <input
                type='text'
                className={styles.signUpInputName}
                placeholder='Last name'
                name='lastName'
                value={signupForm.lastName}
                onChange={handleSignupInputChange}
              />
            </div>
            <input
              type='email'
              className={styles.input}
              placeholder='Email address'
              name='email'
              value={signupForm.email}
              onChange={handleSignupInputChange}
            />
            <input
              type='password'
              className={styles.input}
              placeholder='Password'
              value={signupForm.password}
              name='password'
              onChange={handleSignupInputChange}
            />
            <input
              type='password'
              className={styles.input}
              placeholder='Confirm Password'
              name='passwordConfirm'
              value={signupForm.passwordConfirm}
              onChange={handleSignupInputChange}
            />
            <button className={styles.btnSignUp + ' btn-green'}>Sign Up</button>
          </form>
          {signupFetch.error && (
            <p className='error'>{signupFetch.error.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
