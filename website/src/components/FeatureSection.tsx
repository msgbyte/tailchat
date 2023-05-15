import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import { nightlyUrl } from '../utils/consts';
import './FeatureSection.less';

export const FeatureSection: React.FC = React.memo(() => {
  const { colorMode } = useColorMode();
  const [visibleSection, setVisibleSection] = useState('messenger');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target.id;

          if (entry.isIntersecting) {
            entry.target.classList.add('intersected');
            setVisibleSection(section);
          }
        }
      },
      { rootMargin: '-50% 0% -50% 0%' }
    );

    const elements = document.querySelectorAll(
      '.feature-sections .body > .item'
    );
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  function Pill({ id, label }) {
    return (
      <div
        className={clsx('pill', { active: visibleSection === id })}
        onClick={() => {
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
      >
        {label}
      </div>
    );
  }

  return (
    <section className="feature-sections">
      <Head>
        <link rel="prefetch" href="/img/hero-light.png" as="image" />
        <link rel="prefetch" href="/img/hero-dark.png" as="image" />
        <link rel="preload" href="/img/intro/hello.png" as="image" />
        <link rel="preload" href="/img/intro/ai.png" as="image" />
        <link rel="preload" href="/img/intro/plugins.png" as="image" />
        <link rel="preload" href="/img/intro/roles.png" as="image" />
        <link rel="preload" href="/img/intro/github-bot.png" as="image" />
      </Head>
      <div className="main">
        <div className="title">
          <h2 className="left">
            <Translate>Feature Overview</Translate>
          </h2>

          <div className="right">
            <div className="right-body">
              <Pill id="messenger" label={<Translate>Messenger</Translate>} />
              <Pill id="ai" label={<Translate>AI</Translate>} />
              <Pill id="plugin" label={<Translate>Plugin</Translate>} />
              <Pill id="roles" label={<Translate>Roles</Translate>} />
              <Pill id="bot" label={<Translate>Bot</Translate>} />
              <Pill id="platform" label={<Translate>Platform</Translate>} />
            </div>
          </div>
        </div>

        <div className="body">
          <div className="item" id="messenger">
            <div className="left">
              <h3>
                <Translate>Messenger</Translate>
              </h3>
              <p>
                <Translate>
                  Basic message support, multi message type like
                  text/link/mention/image/file etc. and support append reaction
                  for anything you want with messages.
                </Translate>
              </p>
              <p>
                <Translate>
                  You can join multiple groups, and discuss different topics,
                  perhaps information and notifications, through multiple panels
                  in the group. Not just a simple chat.
                </Translate>
              </p>
              <p>
                <Translate>
                  In the inbox, you can receive anything you need to know, such
                  as mention or plugin notification. Or you can push anything on
                  yourself.
                </Translate>
              </p>
            </div>
            <div className="right">
              <img data-zoomable src="/img/intro/hello.png" />
            </div>
          </div>

          <div className="item" id="ai">
            <div className="left">
              <h3>
                <Translate>AI Assistant</Translate>
              </h3>
              <p>
                <Translate>
                  Communicate by AI, AI Assistant will help you improve your
                  word, simplify your expression and even summary history
                  messages.
                </Translate>
              </p>
              <p>
                <Translate>
                  Thanks for ChatGPT, Communicate with people will be easier and
                  friendly.
                </Translate>
              </p>
              <div className="btns">
                <Link
                  className="button button--primary"
                  to={'https://www.bilibili.com/video/BV1UP41127JS/'}
                >
                  {translate({ message: 'View in Bilibili' })}
                </Link>
              </div>
            </div>
            <div className="right">
              <img data-zoomable src="/img/intro/ai.png" />
            </div>
          </div>

          <div className="item" id="plugin">
            <div className="left">
              <h3>
                <Translate>Plugin Center</Translate>
              </h3>
              <p>
                <Translate>
                  Tailchat has a complete plugin system. With plugins, you can
                  integrate your apps and projects into your chat app in any
                  form you want. Unlike VSCode, Tailchat has fewer restrictions
                  on the form of expression. I think Tailchat is not only a chat
                  app, but also a platform for integrating different
                  applications. You can start a video conference, listen to
                  music, use online tools and more in Tailchat.
                </Translate>
              </p>
              <p>
                <Translate>
                  At the same time, through plugins, you can further improve the
                  chat experience, such as topic panel, end-to-end encryption,
                  rich text, message notification, online drawing, receiving
                  push from third-party applications, etc.
                </Translate>
              </p>
            </div>

            <div className="right">
              <img data-zoomable src="/img/intro/plugins.png" />
            </div>
          </div>

          <div className="item" id="roles">
            <div className="left">
              <h3>
                <Translate>Group Roles</Translate>
              </h3>
              <p>
                <Translate>
                  Tailchat has a builtin RBAC permission management system.
                  Based on the combination of role assignment and permission
                  points, various permission combinations can be matched. At the
                  same time, permission points can be easily integrated by
                  plugins, which are a very flexible design.
                </Translate>
              </p>
              <Link
                className="button button--link"
                to="/docs/contribution/dev/role"
              >
                <Translate>Learn More</Translate>
              </Link>
            </div>
            <div className="right">
              <img data-zoomable src="/img/intro/roles.png" />
            </div>
          </div>

          <div className="item" id="bot">
            <div className="left">
              <h3>
                <Translate>Bot</Translate>
              </h3>
              <p>
                <Translate>
                  Tailchat has a very simple way to integrate third-party
                  applications with bot like most applications. A simple url
                  request or add openapi app or even create a backend plugin.
                  You can use anyway to connect anything, its free!
                </Translate>
              </p>
            </div>

            <div className="right">
              <img data-zoomable src="/img/intro/github-bot.png" />
            </div>
          </div>

          <div className="item" id="platform">
            <div className="left">
              <h3>
                <Translate>Multi-platform Support</Translate>
              </h3>
              <p>
                <Translate>
                  Tailchat design on HTML, and fit any platform or os, but its
                  still some native support cannot provide in web. So Tailchat
                  also has client to provide os support like mobile notification
                  , desktop screenshot and etc.
                </Translate>
              </p>
              <div className="btns">
                <Link className="button button--primary" to={nightlyUrl}>
                  Web
                </Link>
                <Link className="button button--secondary" to="/downloads">
                  Mobile
                </Link>
                <Link className="button button--secondary disabled">
                  Desktop (<Translate>in Alpha Test</Translate>)
                </Link>
              </div>
            </div>
            <div className="right">
              <img data-zoomable src={`/img/hero-${colorMode}.png`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
FeatureSection.displayName = 'FeatureSection';
