---
sidebar_position: 3
title: iam - Third party login
---

`com.msgbyte.iam`

The `IAM` plugin provides third-party login functionality

Currently supported:
- github

## Configuration Method

### Github

Create an OAuth application in `Github`. Get `Client ID` and `Client secrets`

Configure the authorization callback address `Authorization callback URL` of the `Github` application to `{API_URL}/api/plugin:com.msgbyte.iam/github/redirect`. Note that `API_URL` is the value in the environment variable, and the two should be consistent.

Configure Tailchat environment variables:

- IAM_GITHUB_ID
- IAM_GITHUB_SECRET

Respectively, `Client ID` and `Client secrets` obtained before

> You also can use env to overwrite uri, for example use proxy:
>
> - IAM_GITHUB_URI_AUTHORIZE=https://github.com/login/oauth/authorize
> - IAM_GITHUB_URI_ACCESS_TOKEN=https://github.com/login/oauth/access_token
> - IAM_GITHUB_URI_USERINFO=https://api.github.com/user

## Security Protection

In order to prevent tokens from being obtained by malicious applications, it is recommended to add front-end domain name verification.

Just configure `IAM_FE_URL` in the environment variable, and the value is the front-end domain name. Such as: `IAM_FE_URL=http://localhost:11011`

> for `window.opener.postMessage(<data>, "IAM_FE_URL")`
