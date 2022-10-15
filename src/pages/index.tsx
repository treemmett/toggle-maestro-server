import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { List } from '../components/List';
import styles from '../styles/Home.module.css';
import { client } from '../utils/apiClient';
import { Config } from '../utils/config';

export interface OAuthSuccessMessage {
  type: 'OAUTH_CODE';
  payload: string;
}

export interface OAuthErrorMessage {
  type: 'OAUTH_ERROR';
  payload: string;
}

export interface OAuthCloseMessage {
  type: 'OAUTH_CLOSE';
}

const Home: NextPage = () => {
  const [authorizing, setAuthorizing] = useState(false);

  const login = useCallback(() => {
    if (authorizing) return;
    setAuthorizing(true);

    const popup = window.open(
      `https://github.com/login/oauth/authorize?client_id=${Config.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=gist`,
      'oauth',
      `popup,width=500,height=750,left=${global.screen.width / 2 - 250}`
    );

    const intervalId = setInterval(() => {
      if (!popup || popup.closed) {
        setAuthorizing(false);
        clearInterval(intervalId);
      }
    }, 100);
  }, [authorizing]);

  const [value, setValue] = useState('');
  const save = useCallback(async () => {
    await client.post('/manifest', { id: value });
    setValue('');
  }, [value]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta content="Generated by create next app" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing <code className={styles.code}>pages/index.tsx</code>
        </p>

        <button disabled={authorizing} onClick={login} type="button">
          Login with GitHub
        </button>

        <input onChange={(e) => setValue(e.currentTarget.value)} value={value} />

        <button onClick={save} type="button">
          Save
        </button>

        <List />

        <div className={styles.grid}>
          <a className={styles.card} href="https://nextjs.org/docs">
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a className={styles.card} href="https://nextjs.org/learn">
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a className={styles.card} href="https://github.com/vercel/next.js/tree/canary/examples">
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            className={styles.card}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          >
            <h2>Deploy &rarr;</h2>
            <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image alt="Vercel Logo" height={16} src="/vercel.svg" width={72} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
