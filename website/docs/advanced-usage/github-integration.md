---
sidebar_position: 2
title: Github integration
---

![](/img/github-app/github-integration.excalidraw.png)

## Common user use

### Install the application in the project

Link: https://github.com/apps/tailchat

Install into the project repository.

### Configure in the project

Create `.tailchat/topic.json` file in the root directory:
```json
{
  "groupId": "<your-notify-group-id>",
  "panelId": "<your-topic-panel-id>"
}
```

## Self-host configuration

An application needs to be registered in github before the application starts:

![](/img/github-app/github-new-app.png)

The following environment variables need to be configured during deployment:
- `APP_ID`: from the github app settings
- `WEBHOOK_SECRET`: from the github app settings
- `PRIVATE_KEY`: from the github application settings
- `TAILCHAT_APP_ID`: the id of the Tailchat open platform
- `TAILCHAT_APP_SECRET`: The secret key of Tailchat open platform
- `TAILCHAT_API_URL`: Tailchat backend address

In order to obtain `TAILCHAT_APP_ID` and `TAILCHAT_APP_SECRET`, you need to create an open platform application in the Tailchat open platform

At the same time, enable the robot permission and set the message callback link: `https://<your_app_url>/message/webhook`

### Deploy open platform applications

> Source code: [https://github.com/msgbyte/tailchat/tree/master/apps/github-app](https://github.com/msgbyte/tailchat/tree/master/apps/github-app)

After pulling the source code and deploying it to an accessible online, there are two ways:

- Standalone application: execute `node lib/index.js` after `npm run build` to run the application
- Vercel: just push to Vercel directly
