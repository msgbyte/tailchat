import React from 'react';
import { inviteLink } from '../utils/consts';
import Link from '@docusaurus/Link';
import './JoinCommunity.less';

export const JoinCommunity: React.FC = React.memo(() => {
  return (
    <div className="join-community">
      <h3>Join the community</h3>
      <p>
        Engage with our ever-growing community to get the latest updates,
        product support, and more.
      </p>
      <Link className="button button--primary button--lg" href={inviteLink}>
        Join Our Group
      </Link>
    </div>
  );
});
JoinCommunity.displayName = 'JoinCommunity';
