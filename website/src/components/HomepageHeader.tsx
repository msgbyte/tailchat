import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import styled from 'styled-components';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import { useColorMode } from '@docusaurus/theme-common';

const Root = styled.div`
  padding: 4rem 1rem 0;

  @media (min-width: 997px) {
    font-size: 3.75rem;
    height: 540px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .main {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 80rem;

    @media (min-width: 997px) {
      flex-direction: row;
    }

    .header {
      flex: 1;
      text-align: center;

      @media (min-width: 997px) {
        text-align: left;
      }

      .title {
        margin-bottom: 24px;
        font-size: 2.25rem;
        line-height: 1;
        font-weight: 700;

        @media (min-width: 997px) {
          font-size: 3.75rem;
        }
      }

      .desc {
        font-size: 1rem;
        line-height: 1.5rem;
        color: rgb(153, 153, 153);
        font-size: 0.875rem;
        line-height: 1.25rem;

        @media (min-width: 997px) {
          font-size: 1rem;
          line-height: 1.5rem;
          max-width: 32rem;
        }
      }

      .btns {
        margin-bottom: 32px;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        @media (min-width: 997px) {
          flex-direction: row;
        }
      }
    }

    .screenshot {
      flex: 1;
    }
  }
`;

export const HomepageHeader: React.FC = React.memo(() => {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode } = useColorMode();

  return (
    <Root className="hero hero--primary">
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
    </Root>
  );
});
HomepageHeader.displayName = 'HomepageHeader';
