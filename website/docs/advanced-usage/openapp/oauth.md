---
sidebar_position: 5
title: OAuth
---

The `Tailchat` open platform supports the `OAuth` login protocol, and you can easily integrate the `Tailchat` account system into your system. Just like our common `Github Login`, `Google Login`, `Apple Login`

Now, you can use `Tailchat` to implement a unified account management system for your multiple platforms.

## Create a new open platform application in Tailchat

You need to create an open platform application and enable **OAuth** service.

Fill in the address that is allowed to be redirected in **callback address**.

![](/img/advanced-usage/openapp/3.png)

## Create a stand-alone application that initiates and accepts callbacks

First of all, we need to have a general understanding of the basic process of **OAuth** before we officially start

![](/img/advanced-usage/openapp/4.png)

Simply put, it is divided into three steps:

- The first step: access authorization, you need to pass client_id: client id, redirect_uri: redirect uri, response_type is code, scope is the scope of authorization, fill in `openid profile` by default, and state is other custom parameters
- Step 2: After the authorization is passed, it will be redirected to redirect_uri, and the code will be used as its parameter
- Step 3: After getting the code, you can exchange it for an access token, and then you can directly access resources through the token

You can refer to [https://github.com/msgbyte/tailchat/blob/master/server/test/demo/openapi-client-simple/index.ts](https://github.com/msgbyte/tailchat/blob /master/server/test/demo/openapi-client-simple/index.ts) to implement your own OAuth application

### Main process

Here is a brief overview of the process:

First construct a request address, like:
```
<API>/open/auth?client_id=<clientId>&redirect_uri=<redirect_uri>&scope=openid profile&response_type=code&state=123456789
```

in:
- `API` is your tailchat backend address, if you use the default deployment scheme, it is your access address.
- `clientId` is the address of the open platform you applied for in the first step.
- `redirect_uri` is your callback address, you need to make sure it has been added to the whitelist of allowed callback addresses
- `scope` is the scope of application authorization, currently fill in `openid profile` fixedly
- `response_type` is the response type, just fill in `code`
- `state` and other custom parameters will be called with redirection and `code` parameters.

After the user visits this address, it will jump to the Tailchat platform for login authorization. If the authorization is passed, it will be redirected to the address specified by `redirect_uri`. At this time, the receiving address can get `code` and `state` in the query string.

In the next step, we need to exchange `code` for `token` by sending a POST request. Next, we need to use `token` to obtain user information

```
POST <API>/open/token
{
  "client_id": clientId,
  "client_secret": clientSecret,
  "redirect_uri": redirect_uri,
  "code": code,
  "grant_type": 'authorization_code',
}
```

return value:
```
{
  access_token,
  expires_in,
  id_token,
  scope,
  token_type
}
```

At this point we got the `access_token`, which we can use to request user information:

```
POST <API>/open/me
{
  "access_token": access_token,
}
```

return value:
```
{
  sub,
  nickname,
  discriminator,
  avatar,
}
```

Among them, `sub` can be understood as the user's id, which is the unique identifier of the user
