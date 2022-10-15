import type { NextPage } from 'next';
import Head from 'next/head';
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
        <title>Toggle Maestro</title>
        <meta content="Toggle those features, with finesse" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <button disabled={authorizing} onClick={login} type="button">
          Login with GitHub
        </button>

        <input onChange={(e) => setValue(e.currentTarget.value)} value={value} />

        <button onClick={save} type="button">
          Save
        </button>

        <List />
      </main>
    </div>
  );
};

export default Home;
