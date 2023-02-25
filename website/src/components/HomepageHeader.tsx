import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import { useColorMode } from '@docusaurus/theme-common';
import './HomepageHeader.less';

export const HomepageHeader: React.FC = React.memo(() => {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode } = useColorMode();

  return (
    <div className="homepage-header">
      <Head>
        <link rel="prefetch" href="/img/hero-light.png" />
        <link rel="prefetch" href="/img/hero-dark.png" />
      </Head>

      <div className="screenshot flex-1 xl:flex-none">
        <img src={`/img/hero-${colorMode}.png`} alt="Preview of Tailchat" />
      </div>

      <div className="header">
        <h1 className="title">Open Source, Open Platform</h1>
        <p className="desc">Tailchat: {siteConfig.tagline}</p>

        <div className="btns">
          <Link
            className="button button--primary button--lg"
            to="https://nightly.paw.msgbyte.com/invite/8Jfm1dWb"
          >
            <Translate>Join our Group</Translate>
          </Link>

          <Link
            className="button button--secondary button--lg"
            href="/docs/intro"
          >
            <Translate>Learn More</Translate>
          </Link>
        </div>

        <div className="link">
          <Link to="https://nightly.paw.msgbyte.com/">
            <Translate>Or direct visit Tailchat nightly version</Translate>
          </Link>
        </div>
      </div>
    </div>
  );
});
HomepageHeader.displayName = 'HomepageHeader';
