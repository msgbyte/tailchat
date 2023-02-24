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
    <div className="homepage-header hero hero--primary">
      <Head>
        <link rel="prefetch" href="/img/hero-light.png" />
        <link rel="prefetch" href="/img/hero-dark.png" />
      </Head>

      <div className="main">
        <div className="header">
          <h1 className="title">{siteConfig.title}</h1>
          <p className="desc">{siteConfig.tagline}</p>

          <div className="btns">
            <Link
              className="button button--info button--lg"
              to="https://nightly.paw.msgbyte.com/"
            >
              <Translate>Nightly version</Translate>
            </Link>

            <Link
              className="button button--secondary button--lg"
              href="/docs/intro"
            >
              <Translate>Learn More</Translate>
            </Link>
          </div>
        </div>
        <div className="screenshot flex-1 xl:flex-none">
          <img src={`/img/hero-${colorMode}.png`} alt="Preview of Tailchat" />
        </div>
      </div>
    </div>
  );
});
HomepageHeader.displayName = 'HomepageHeader';
