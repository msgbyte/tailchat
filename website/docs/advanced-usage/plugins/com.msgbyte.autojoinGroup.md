---
sidebar_position: 4
title: auto join group
---

`com.msgbyte.autojoinGroup`

Just need config environment: `AUTOJOIN_GROUP_ID=xxxxx` and restart application

You should create group from admin or web app manually. and then you can get a groupId.

In web app, you can get groupId from url, for example: `/main/group/<groupId>/<panelId>`

> If you wanna join more than one group after user register, you can split with `,`
>
> For example: AUTOJOIN_GROUP_ID=xxxxx,xxxx
