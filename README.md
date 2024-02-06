# Tailchat

[![Docker Publish](https://github.com/msgbyte/tailchat/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/msgbyte/tailchat/actions/workflows/docker-publish.yml)
![Docker Image Version (tag latest semver)](https://img.shields.io/docker/v/moonrailgun/tailchat/latest)
![Docker Pulls](https://img.shields.io/docker/pulls/moonrailgun/tailchat)
[![CI](https://github.com/msgbyte/tailchat/actions/workflows/ci.yaml/badge.svg)](https://github.com/msgbyte/tailchat/actions/workflows/ci.yaml)
[![Codemagic build status](https://api.codemagic.io/apps/63e27be62b9d4ca848b5491d/android/status_badge.svg)](https://codemagic.io/apps/63e27be62b9d4ca848b5491d/android/latest_build)
[![Desktop Build](https://github.com/msgbyte/tailchat/actions/workflows/desktop-build.yml/badge.svg)](https://github.com/msgbyte/tailchat/actions/workflows/desktop-build.yml)
[![deploy nightly](https://github.com/msgbyte/tailchat/actions/workflows/vercel-nightly.yml/badge.svg)](https://github.com/msgbyte/tailchat/actions/workflows/vercel-nightly.yml)
![Tailchat Nightly](https://tianji.moonrailgun.com/monitor/clnzoxcy10001vy2ohi4obbi0/clo1oiwbp001dof5e76cmkzj9/badge.svg)

![tailchat](https://socialify.git.ci/msgbyte/tailchat/image?description=1&font=Inter&forks=1&issues=1&language=1&logo=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F86033898%3Fs%3D200%26v%3D4&name=1&owner=1&pattern=Circuit%20Board&stargazers=1&theme=Light)

[简体中文](./README.zh.md)

## Next generation noIM application in your own workspace

### Not only another `Slack`, `Discord`, `Rocket.Chat`....

If you are interested in the concept of `noIM`, welcome to read my blog:
- [It's time to officially step into the era of noIM](https://tailchat.msgbyte.com/blog/2023/03/01/the-era-of-noIM)

Official Documentation: [https://tailchat.msgbyte.com/](https://tailchat.msgbyte.com/)

**Nightly version** Try it online: [https://nightly.paw.msgbyte.com/](https://nightly.paw.msgbyte.com/)

> Nightly version is the automatic compile version, that means, every commit code will be automatically compiled.
> The reliability and stability of the data are not guaranteed, you can deploy with stable version with docker images or github release page

## Motivation

At present, the existing IM applications only focus on chatting itself, and IM is naturally a multi-person collaboration method. In my opinion, it should be able to take on more responsibilities, and form its own unique way of forwarding external applications through IM workflow.

Therefore, I bring up the point of `noIM`, which means **Not only IM**. Instead, it designed a highly customized application platform for individuals/teams centered on IM, with third-party applications as enhanced functions, and a plugin system as the glue connection layer in the middle.

To this end, the functions were abstracted, and a lot of time was spent designing the underlying mechanism. An instant messaging application such as `Tailchat` was born for expansion from the beginning of the underlying design. Through `Tailchat`'s plugin system, developers can easily use their favorite applications as part of `Tailchat` in a very natural way. Different from traditional integration methods such as `Slack`, the integration of `Tailchat` is more free, as if it is a native function.

## Feature

- Pay attention to privacy, only invited members can join the group
- Prevent strangers, add friends only by nickname + a random string of numbers
- Two-level group space, dividing different topics by panels
- Highly customized group space, create original group space by grouping with dragging and dropping. At the same time, more plugins can be used to add more capabilities
- It can be rigorous or fun. Through the combination of plugins, `Tailchat` can be created for different scenarios. It can be for individuals or for enterprises
- The backend microservice structure is ready for large-scale deployment. Don't worry about what to do after the number of user growth

Learn more in our [website](https://tailchat.msgbyte.com/)

## Performance and Expansion

Tailchat is a modern open source IM application which based on **React** + **Typescript**

Front-end microkernel architecture + backend microservice architecture, `Tailchat` is ready for clustering deployment.

The front end empowers the application through the plugin system, which is very simple and easy to expand for the secondary development of `Tailchat`.

**NOTICE: Although the core functionality of Tailchat is currently in a stable stage, its exposed interface for third-party developers is still being improved. Generally speaking, it is backward compatible, but retains the possibility of Break Change**

## Preview

![](./website/static/img/intro/hello.png)

![](./website/static/img/intro/plugins.png)

![](./website/static/img/intro/roles.png)

Visit the official website to learn more: [https://tailchat.msgbyte.com/](https://tailchat.msgbyte.com/)

## Deploy on Sealos

[![Deploy on Sealos](https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg)](https://cloud.sealos.io/?openapp=system-template%3FtemplateName%3Dtailchat)

## Communication

If you are interested in `Tailchat`, welcome to join `Tailchat`'s seed user exchange group, your feedback can help `Tailchat` grow better

### Tailchat

[Tailchat Nightly Group](https://nightly.paw.msgbyte.com/invite/8Jfm1dWb)

### Producthunt

<a href="https://www.producthunt.com/posts/tailchat?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-tailchat" target="_blank">
<img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=382080&theme=light" alt="Tailchat - The&#0032;next&#0045;generation&#0032;noIM&#0032;Application&#0032;in&#0032;your&#0032;own&#0032;workspace | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
</a>

## Project Activity

![Alt](https://repobeats.axiom.co/api/embed/b85cb500d902e0ad0cecb582557c006d8b663a01.svg "Repobeats analytics image")

## License

[Apache 2.0](./LICENSE)
