import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import { HomepageHeader } from '../components/HomepageHeader';
// @ts-ignore
import { ColorModeProvider } from '@docusaurus/theme-common/internal';
import { FeatureSection } from '../components/FeatureSection';
import { useMediumZoom } from '../utils/useMediumZoom';
import { JoinCommunity } from '../components/JoinCommunity';

// function HomepageVideo() {
//   return (
//     <div className={styles.videoContainer}>
//       <iframe
//         className={styles.videoIframe}
//         src="//player.bilibili.com/player.html?aid=340398093&bvid=BV1394y1Z76n&cid=568332564&page=1"
//         scrolling="no"
//         border="0"
//         frameBorder="no"
//         frameSpacing="0"
//         allowFullScreen="true"
//       >
//         {' '}
//       </iframe>
//     </div>
//   );
// }

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  useMediumZoom();

  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description={`${siteConfig.tagline}`}
    >
      <ColorModeProvider>
        <HomepageHeader />

        <main>
          {/* TODO: Global Support */}
          {/* <HomepageVideo /> */}

          <FeatureSection />

          {/* <HomepageFeatures /> */}

          <JoinCommunity />
        </main>
      </ColorModeProvider>
    </Layout>
  );
}
