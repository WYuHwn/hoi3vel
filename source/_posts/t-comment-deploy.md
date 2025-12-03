---
title: Hexo博客引入Giscus评论系统
single_column: true
author: Ewan
toc: false
date: 2024/05/31 22:13:00
updated: 2025/11/21 21:29:00
categories: ['Tech']
tags: ['Giscus', 'Deployment', 'Hexo', 'Guidance']
leftbar: [related, recent]
topic: Env-Deploy
---
> 其实将Giscus评论系统引入Hexo博客中操作很简单，但是想到自己一开始看着[Hexo-Theme-Async](https://hexo-theme-async.imalun.com/guide/config)文档所介绍的操作依然不知所措的场景，最后还是决定写篇文章讲讲具体的流程。
<!-- more -->
# 一、前言
Giscus是由[Github Discussions](https://docs.github.com/en/discussions)实现的评论系统，它主要有三个优点：①开源；②无跟踪、无广告且永久免费；③无需数据库，所有数据均存储在Github Discussions中。
## 1.工作原理
Gicsus使用Github Discussions作为数据库存储博客下面的评论。Giscus插件加载时会使用Github Discussions搜索API根据选定的映射方式(如URL、Pathname等)来查找与当前页面关联的discussion。若找不到匹配的discussion，Giscus bot就会在第一次有人留下评论或回应时自动创建一个discussion。访客通过登录Github账号在博客页面进行留言，而作者可以在Github对应仓库上管理评论。
# 二、具体流程
## 1.引入Giscus
Hexo主题[Hexo-Theme-Async](https://hexo-theme-async.imalun.com/)支持Giscuss评论，因此引入步骤很简单，具体流程如下:
- 在Github上选择一个仓库作为存储Discussions的仓库，一般选择博客本身所在的仓库(e.g.Github用户名/Github用户名.github.io)，当然也可以新建一个仓库。
- 安装[Giscus](https://github.com/apps/giscus)
- 开启作为存储Discussions仓库的Discussions功能: 选择GIthub仓库->Settings->Features模块中勾选Discussions
## 2.配置Giscus
上述操作完成后，进入[Giscus官网](https://giscus.app/zh-CN)获取配置信息，填写完**仓库**和**分类**后就可在显示配置信息，生成的配置信息样例如下:![giscus配置信息样例](https://img.hoi3vel.cn/tech/giscus_deploy.webp)
分类可以选择`Announcements`、`Q&A`等，不一定按照推荐选择分类。

在此配置信息中我们只需关注**data-repo**、**data-repo-id**、**data-categories**、**data-category-id**这些信息。

## 3.引入至博客
在`_config.async.yml`中配置如下:![Hexo配置文件](https://img.hoi3vel.cn/tech/hexo_giscus.webp)
图中打码部分为专属配置信息，其中theme主题可自己更改，可供选择主题可在[Giscus官网](https://giscus.app/zh-CN)查看。

## 4.效果视图
白天模式下:![giscus_exmaple](https://img.hoi3vel.cn/tech/giscus_example.webp)
黑夜模式下:![giscus_example_dark](https://img.hoi3vel.cn/tech/giscus_example_dark.webp)
评论的管理可在Github中对应仓库的**Discussions**中实现