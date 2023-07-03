import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import Translate from '@docusaurus/Translate';
import clients from '../../static/downloads/client.json';
import './downloads.less';

export default function Downloads() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description={`${siteConfig.tagline}`}
    >
      <main>
        <div className="downloads-page">
          <div className="section">
            <div className="block">
              <img src="/img/gallery/download/mobile.png" />
            </div>

            <div className="block">
              <h3>
                <Translate>Mobile Apps</Translate> (test)
              </h3>

              <p>
                <Translate>Use mobile app to visit Tailchat anywhere</Translate>
              </p>

              <div className="btns">
                <Link
                  className="button button--primary"
                  to={clients.android.url}
                >
                  Android
                </Link>
                <Link className="button button--secondary disabled">
                  iOS(Coming soon)
                </Link>
              </div>

              <p className="tip">
                <Translate>Design with react-native</Translate>:&nbsp;
                <Link to="https://github.com/msgbyte/tailchat/tree/master/client/mobile">
                  <Translate>Source Code</Translate>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
