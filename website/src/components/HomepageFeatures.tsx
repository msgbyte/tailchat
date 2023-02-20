import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import { translate } from '@docusaurus/Translate';

const FeatureList = [
  {
    title: translate({ message: 'Easy to use' }),
    Svg: require('../../static/img/undraw_Website_setup_re_d4y9.svg').default,
    description: (
      <>
        The basic design of <code>Tailchat</code> is borrowed from{' '}
        <code>Discord</code>, but with <code>Discord</code> is different,{' '}
        <code>Tailchat</code> Use the concept of panels instead of channels.
        This makes groups capable of more than just chatting.
      </>
    ),
  },
  {
    title: translate({ message: 'Easy to expand' }),
    Svg: require('../../static/img/undraw_design_components_9vy6.svg').default,
    description: (
      <>
        <code>Tailchat</code> is based on the microkernel + microservice
        architecture, and has carefully designed a unique plug-in system, which
        is easy to expand in terms of business and scale, and is sufficient to
        support business and needs of any size
      </>
    ),
  },
  {
    title: translate({ message: 'Open source' }),
    Svg: require('../../static/img/undraw_open_source_1qxw.svg').default,
    description: (
      <>
        <code>Tailchat</code> is an open source software, anyone can submit the
        ability they want to Tailchat. We always believe that the power of open
        source can make an application better
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
