---
title: Share how I have operated open source projects and reached 1k star in the past few years
authors: moonrailgun
image: /img/logo.svg
slug: share-1kstar
keywords:
  - tailchat
tags: [Share]
---

I developed an IM project [Tailchat](https://tailchat.msgbyte.com/), and finally reached the 1k star milestone in the early morning of June 28, 2023. I am very excited. Of course, for many well-known open source projects, this only need takes a few days, but it is still very important for me. Therefore, I really want to share how I operate an open source project as an open source enthusiast.

![](/img/blog/1kstar/1.png)

![](/img/blog/1kstar/2.png)

First of all, I must admit that I am a very typical and pure programmer. I have no background, no resources, and I am not good at communication. It can be said that I am a relatively socially phobic person. For people like me, the difficulty is not how to develop an app, but how to promote my app after the development is completed or reaches a certain stage, so that everyone can understand my philosophy.

Once, I naively thought that open source was just sharing the source code so that everyone could see my code. However, I gradually realized that open source is more like a business. It not only needs to develop its own products, but also needs to find ways to sell the products.

## A good official website is very important

The official website is the facade of an application, and for many libraries, the README is their official website. However, for relatively large and complex projects, a simple README may not provide enough information, and an independent official website page becomes very important.

An excellent official website can increase users' trust in the project. Usually, my basic trust in open source projects comes from the following aspects: whether there is a README or official website, whether there are enough stars, and how much usage/download.

For example, Tailchat's official website https://tailchat.msgbyte.com/ has become quite good after a few iterations. The first screen occupies almost the entire page, and shows previews of desktop and mobile, which means that my project supports both desktop and mobile. Then succinctly list the characteristics that I think are important, and these are also the key points that I want my product to distinguish from other similar projects.

The official website is the embodiment of product thinking. Convey your ideas to users through the official website, so that users can understand your design philosophy and why you want to make such a product.

On the other hand, the official website also provides guidance for users during use. Unless your product does not require users to do anything, just open it and use it (such as various small games), a complete document will help users far beyond your imagination.

Don't think that you can stop doing these things just because the source code is open source. The code itself is the document. Recalling our own development experience, when using a library, we would not choose to view the source code unless we had to. This is true for libraries, let alone a complete project?

For open source projects, a complete and multi-platform compatible deployment method is the most basic bottom line.

## Focus on differentiation

For open source projects, the easiest way to introduce your products to others is the open source alternative of xxxx, where xxxx is generally a commercial application that you are familiar with. This can give users a very basic idea of your product very quickly. You can also quickly establish a basic concept through everyone's consensus.

For example, if you want to build an online shopping mall, then you can say that you have created a substitute for Amazon. For example, if you want to make a forum, you can say that you want to make a substitute for discuz.

However, while saying that your project is a substitute for xxxx, you need to always be clear about the differences between yourself and the other party, instead of constantly copying the functions of other projects. For example, when I introduce and promote my project with others, I will say that I am an IM, an open source alternative to discord/slack. But at the same time I will also emphasize that it is not just an IM. I will talk with the other party about why we need a plug-in system and what the plug-in system can bring us, why I spend 2 years on the underlying architecture and polishing the system to complete this architecture, and why I think my product is excellent. for other projects.

This is a very difficult thing to do. Because most users don't care about your differences. For most users, only the most basic functions are used, and users are more concerned about whether they can meet their needs. A very sad thing is that no matter what you do, you will have many peers competing with you. The reason why users decide whether to use your product is not because of how powerful your functions are, but whether your functions can meet the needs—— Of course, if you have enough functions, so many that all imaginable needs can be met. But that is what companies do. If you are an individual open source developer, you must learn to focus and focus on differentiation.

## Emphasis on the international market

Multilingualism is a very necessary thing. Although China has a huge market, let's take a longer view. The Chinese market is only 1/5 of the global market. Especially in the open source field, you as a developer don't have to care about language boundaries. Because you are not in control of the differences in laws and regulations and privacy policies in various places. As a developer, you only need to make your product well.

Therefore, it is very important to support multiple languages. Supporting at least English can greatly expand your audience. If you are not confident about your English level, please make good use of translation software.

In addition, you can go to overseas platforms to promote your application, not just limited to domestic platforms. Such as Reddit, Hackernews, medium, etc. Don't limit yourself to your own country

## Give users a sense of trust through perfect documentation and automated testing

Although a thick instruction manual will not bring any real value to the product itself, it will at least make users who pay attention to this product feel at ease.

Security is a very metaphysical thing. As a developer, you can say that your project is very easy to use and does not require any documentation at all. But even if you don't read these documents, the existence of these documents will give users a kind of trust, at least it can show that you have paid enough attention to your project.

There are similar automated test scripts, the former is for ordinary users, and the latter is for developers.

As developers, we all know the importance of CICD. CICD is an important way to ensure the code quality of a project, and it also means the bottom line of a project. If one doesn't have any CICD workflows or are all failed workflows. Then I would be very, very distrustful of it.

Open source projects naturally lack trust compared to commercial projects, because the latter are used for profit and can be used to support the operation of enterprises, which means that at least there will be no problems. And open source projects often originate from interests, which naturally give people a feeling of unreliability. Especially when the number of stars in the early stage is relatively low.

How to break this sense of distrust is also an important factor for open source maintainers to make their projects work.

## String your content together to reduce exploration costs

A very bad example is to put relevant content everywhere, making it very difficult for users to see all the content.

It is very important to have important content indexed in one place. Such as your social media, your documentation, your function manual, your demo environment, your various technical blogs....

Reduce the user's exploration cost, because if the cost is too high, the user is likely to choose to give up. That's why most sites have keywords in the footer

If you only have a README file, add all the links to the documentation so the user can clear what's there and what it's for.

Also, not just your various content, but your project itself should keep this in mind. For example, it is easy to dissuade people from registering with a mobile phone number, and a proper public content experience can better allow users to experience the charm of the product and retain it for a long time. This is what I do in Tailchat. Users can log in with a temporary account, and only need to fill in a nickname to experience the full functionality. When the user decides to keep your account for a long time, you can go through the registration process to claim the temporary account. If you want to let users join your community, you can even directly replace the entry with an invitation link.

Similarly, if your project contains multiple sub-projects. Monorepo will be a better choice than multiple warehouses. I once wrote a blog about this from a technical point of view, [talking about the benefits of merging multiple projects into one project](http://moonrailgun.com/posts/2674f04a/).

From the perspective of open source operations, multiple project repositories not only make it more difficult for users to see the whole picture, but also undermine the confidence of open source contributors, because everyone expects contributors to large projects to have their own profile pictures, even if they just change the document typo.

## Pay attention to the operation of the community and the ecology

The operation of the community is a very important part of an open source project. Only continuous feedback from the community can pull up a positive cycle of open source projects. The simplest community is to set up a reddit channel or discord group. When I was operating in the early days, I thought that since I am doing IM, why should I go to other IM platforms to operate my community? However, this is wrong, because as a developer, you should accommodate users instead of letting users accommodate you. If users prefer to use reddit, then you should choose to use reddit. If users use discord more, then you should build your own community on discord. Keeping the community active is the first element.

I really like Notion's ambassador culture and community culture. Establishing a good community-driven ecology is an essential quality for a successful open source project. Although my project is far from reaching this stage, I have studied many successful open source projects without exception. Simply put, open source is a carnival for idealists, and a good open source project is a carnival for a group of idealists. It is a very difficult thing to let users recognize your project and promote it spontaneously, but it is necessary to do it. It is much easier for a group of people to advance than one person.

On the other hand, we need to pay attention to the value of developers. What is developer value? It is what your project can bring to developers. When promoting Tailchat, I often make an analogy with vscode. vscode is a plug-in text editor. Its ontology is an expansion center + monaco editor, and its value lies in a good developer ecology. Allow different developers to realize their own ideas through vscode's plug-in system and integrate different language support. I don’t know if anyone still remembers that github had its own editor atom before github was acquired by Microsoft. I also like to use it very much, atom has been deprecated since Microsoft acquired github. I believe that Microsoft also sees the great potential of the plug-in system. And Tailchat also uses the plug-in system as the underlying capability at the beginning of the design. One of my favorite sayings is: "A Product That Gets Developer Love Gets Everything". This is also the power of ecology. When the ecology is up, it will be difficult for your product to be replaced by other similar applications.

## Revisit your early adopters at the right time

It is very important to maintain seed users in the early stage. Revisit your early users in a timely manner to make your users feel that they are valued and motivated by this product. This will greatly increase the possibility of your users turning into community contributors.

Many technical people think that only code contribution is contribution. In fact, there are only a small number of people who understand the code, not to mention that there are even fewer people who need to match the technology stack of your project. If many people can make suggestions, I think it is very good for an open source project to do an international translation. up. The most important thing is that these things will be what you move forward. People want to keep moving forward either by money or interest, and the community is a gas station that continuously recharges your interest.

The early entrepreneurs I came into contact with would like to make appointments with their users to chat about the development of their projects and users' opinions. If you don't feel like you can do that, it's okay to greet with a text. Believe me, the rewards will be greater than imagined.

## Actively blog and write technical articles

I am very disgusted to promote my project by constantly and repeatedly sending the introduction of my project in various technical communities like an advertising robot. Although it seems to be a bit of a scholar's aloofness, I still feel that this kind of behavior greatly affects the experience of other people. Some people may say that it is better to be disgust than no one knows, but this is a selfish act of sacrificing other people's experience to achieve one's own.

My choice as a technical person is to write more blogs and technical documents. Promote your own projects in technical articles. I hope this should be a win-win behavior: as a reader, you gain knowledge, and as a writer, I gain exposure.

At the same time, writing articles is also a sorting out of your own ideas, which is similar to writing technical documents. I used to be very disgusted with writing technical documents, because things that can be written directly by writing code still need to write technical documents to restrain myself. Generally speaking, the time for writing technical documents is about the same as the time for writing codes, because to write a correct technical document, it is often necessary to determine the possibility of the solution. Basically, to determine the feasibility of the solution, most of the code is almost written. But now I understand the necessity of writing technical documents, more to organize my thoughts. Writing code is easy, writing code that people can understand is difficult, and writing code that people can understand and maintain later is the most difficult. I used to rely on my own experience to achieve easy maintenance in the later stage, and the technical documentation is to add a layer of CICD to constrain behavior on the basis of my reliance on experience. The same is true for writing technical articles. While writing code, you must organize things to form a methodology. This is also a kind of improvement of one's own ability.

## Summarize

Open source is bumpy in the end, and there is a high probability that there will be no actual benefits in the end. That's why I say open source is a carnival for idealists.

Open source projects often do not pursue profit and pay a lot. In addition to writing code, they also need to devote energy to publicity and operation. It is a thankless task for most people.

Of course, what I'm talking about here are real open source projects that require long-term efforts. If it is only for high star, there are actually many ways to use it for job hunting or other purposes. Many projects have only a few lines of code, but there are still many hot projects such as tens of thousands of stars on github.

On the contrary, my topic is undoubtedly the Red Sea in the Red Sea. On the C side, there were giants that occupied the market early more than ten years ago, and there are also many powerful competitors competing on the B side. Also in open source, there are countless similar products competing with each other. The reason why I still choose IM as my open source project direction, and I have worked hard for several years so far. I also believe that my design concept will stand out among a bunch of similar competitors with serious homogeneity. Of course, it is undeniable that there will be a possibility of failure. Maybe this is an idealist, and I am willing to devote my heart and soul to my ideal.

I believe that the world is often changed by idealists. Given the choice, I prefer to work with a group of idealists. I believe that you who see the end must also be a person who loves open source, encourage each other, and go on together.
