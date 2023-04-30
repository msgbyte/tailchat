import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
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
              <h3>Mobile Apps (test)</h3>

              <p>Use mobile app to visit Tailchat anywhere</p>

              <div className="btns">
                <Link
                  className="button button--primary"
                  to="https://tailchat-app.msgbyte.com/app-release.apk"
                >
                  Android
                </Link>
                <Link className="button button--secondary disabled">
                  iOS(Coming soon)
                </Link>
              </div>

              <p className="tip">
                Design with react-native:&nbsp;
                <Link to="https://github.com/msgbyte/tailchat/tree/master/client/mobile">
                  Source Code
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
