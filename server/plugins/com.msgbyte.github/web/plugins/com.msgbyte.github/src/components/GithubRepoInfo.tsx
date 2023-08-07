import React from 'react';
import { useParams } from 'react-router';

interface GithubRepoName {
  owner: string;
  repo: string;
}

export const GithubRepoInfo: React.FC<GithubRepoName> = React.memo((props) => {
  return <div>GithubRepoInfo {JSON.stringify(props)}</div>;
});
GithubRepoInfo.displayName = 'GithubRepoInfo';

export const GithubRepoInfoRoute: React.FC = React.memo(() => {
  const params = useParams<GithubRepoName>();

  return (
    <div>
      <GithubRepoInfo owner={params.owner} repo={params.repo} />
    </div>
  );
});
GithubRepoInfoRoute.displayName = 'GithubRepoInfoRoute';
