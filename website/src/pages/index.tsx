import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import Translate from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://nightly.paw.msgbyte.com/"
          >
            <Translate>Try in Nightly version</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageVideo() {
  return (
    <div className={styles.videoContainer}>
      <iframe
        className={styles.videoIframe}
        src="//player.bilibili.com/player.html?aid=340398093&bvid=BV1394y1Z76n&cid=568332564&page=1"
        scrolling="no"
        border="0"
        frameBorder="no"
        framespacing="0"
        allowFullScreen="true"
      >
        {' '}
      </iframe>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageVideo />

        <HomepageFeatures />
      </main>
    </Layout>
  );
}
