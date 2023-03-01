import React, { useReducer } from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import { useColorMode } from '@docusaurus/theme-common';
import { inviteLink, nightlyUrl } from '../utils/consts';
import './HomepageHeader.less';

const alternative = ['Slack', 'Discord', 'Rocket.Chat'];

export function getRandomAlternative() {
  return alternative[Math.floor(Math.random() * alternative.length)];
}

export const HomepageHeader: React.FC = React.memo(() => {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode } = useColorMode();
  const [alternativeIndex, updateAlternative] = useReducer(
    (index) => (index + 1) % alternative.length,
    Math.floor(Math.random() * alternative.length)
  );

  return (
    <div className="homepage-header">
      <Head>
        <link rel="prefetch" href="/img/hero-light.png" />
        <link rel="prefetch" href="/img/hero-dark.png" />
      </Head>

      <div className="screenshot">
        <img src={`/img/hero-${colorMode}.png`} alt="Preview of Tailchat" />
      </div>

      <div className="header">
        <h1 className="title">Open Source, Open Platform</h1>
        <h3 className="title">
          Not only Another{' '}
          <strong onClick={updateAlternative}>
            {alternative[alternativeIndex]}
          </strong>
        </h3>

        <p className="desc">
          Tailchat: {siteConfig.tagline}
          <small>
            <Link href="/blog/2023/03/01/the-era-of-noIM">
              What is noIM(not only IM)?
            </Link>
          </small>
        </p>

        <div className="btns">
          <Link className="button button--primary button--lg" to={inviteLink}>
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
          <Link to={nightlyUrl}>
            <Translate>Or direct visit Tailchat nightly version</Translate>
          </Link>
        </div>
      </div>
    </div>
  );
});
HomepageHeader.displayName = 'HomepageHeader';
