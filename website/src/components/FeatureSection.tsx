import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
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

  function Pill({ section }) {
    return (
      <div
        className={clsx(
          'pill',
          'flex-1 cursor-pointer rounded-md py-2 px-6 text-center font-jakarta text-sm font-semibold',
          { active: visibleSection === section }
        )}
        onClick={() => {
          document
            .getElementById(section)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
      >
        {`${section[0].toUpperCase()}${section.substring(1)}`}
      </div>
    );
  }

  return (
    <section className="feature-sections">
      <Head>
        <link rel="prefetch" href="/img/hero-light.png" as="image" />
        <link rel="prefetch" href="/img/hero-dark.png" as="image" />
        <link rel="preload" href="/img/intro/hello.png" as="image" />
        <link rel="preload" href="/img/intro/plugins.png" as="image" />
        <link rel="preload" href="/img/intro/roles.png" as="image" />
        <link rel="preload" href="/img/intro/github-bot.png" as="image" />
      </Head>
      <div className="main">
        <div className="title">
          <h2 className="left">Feature Overview</h2>

          <div className="right">
            <div className="right-body">
              <Pill section="messenger" />
              <Pill section="plugin" />
              <Pill section="roles" />
              <Pill section="bot" />
              <Pill section="platform" />
            </div>
          </div>
        </div>

        <div className="body">
          <div className="item" id="messenger">
            <div className="left">
              <h3>Messenger</h3>
              <p>
                Basic message support, multi message type like
                text/link/mention/image/file etc. and support append reaction
                for anything you want with messages.
              </p>
              <p>
                You can join multiple groups, and discuss different topics,
                perhaps information and notifications, through multiple panels
                in the group. Not just a simple chat.
              </p>
              <p>
                In the inbox, you can receive anything you need to know, such as
                mention or plugin notification. Or you can push anything on
                yourself.
              </p>
            </div>
            <div className="right">
              <img data-zoomable src="/img/intro/hello.png" />
            </div>
          </div>

          <div className="item reverse" id="plugin">
            <div className="left">
              <h3>Plugin Center</h3>
              <p>
                Tailchat has a complete plugin system. With plugins, you can
                integrate your apps and projects into your chat app in any form
                you want. Unlike VSCode, Tailchat has fewer restrictions on the
                form of expression. I think Tailchat is not only a chat app, but
                also a platform for integrating different applications. You can
                start a video conference, listen to music, use online tools and
                more in Tailchat.
              </p>
              <p>
                At the same time, through plugins, you can further improve the
                chat experience, such as topic panel, end-to-end encryption,
                rich text, message notification, online drawing, receiving push
                from third-party applications, etc.
              </p>
            </div>

            <div className="right">
              <img data-zoomable src="/img/intro/plugins.png" />
            </div>
          </div>

          <div className="item" id="roles">
            <div className="left">
              <h3>Group Roles</h3>
              <p>
                Tailchat has a builtin RBAC permission management system. Based
                on the combination of role assignment and permission points,
                various permission combinations can be matched. At the same
                time, permission points can be easily integrated by plugins,
                which are a very flexible design.
              </p>
              <Link
                className="button button--link"
                to="/docs/contribution/dev/role"
              >
                Learn More
              </Link>
            </div>
            <div className="right">
              <img data-zoomable src="/img/intro/roles.png" />
            </div>
          </div>

          <div className="item reverse" id="bot">
            <div className="left">
              <h3>Bot</h3>
              <p>
                Tailchat has a very simple way to integrate third-party
                applications with bot like most applications. A simple url
                request or add openapi app or even create a backend plugin. You
                can use anyway to connect anything, its free!
              </p>
            </div>

            <div className="right">
              <img data-zoomable src="/img/intro/github-bot.png" />
            </div>
          </div>

          <div className="item" id="platform">
            <div className="left">
              <h3>Multi-platform Support</h3>
              <p>
                Tailchat design on HTML, and fit any platform or os, but its
                still some native support cannot provide in web. So Tailchat
                also has client to provide os support like mobile notification ,
                desktop screenshot and etc.
              </p>
              <div className="btns">
                <Link className="button button--primary" to={nightlyUrl}>
                  Web
                </Link>
                <Link className="button button--secondary disabled">
                  Mobile (in Alpha Test)
                </Link>
                <Link className="button button--secondary disabled">
                  Desktop (in Alpha Test)
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
