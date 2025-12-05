---
title: Git知识总结
date: 2025/12/05 20:31:00
updated: 2025/12/05 22:31:00
categories: ['Tech']
tags: ['Git']
leftbar: [related, recent]
topic: Major
---
>最近又开始使用Git工具部署项目了，太久没用很多基本的语法都忘记了，再加上自己博客也好久没更新文章了。于是乎，接着这个机会就对Git知识进行一次总结吧。
<!-- more -->

# 一、前言
## 1.Git工作流程
**Git**工作区域可以分为四个：①远程仓库；②本地仓库；③暂存区；④Workspace(即本地项目文件夹)。通过使用`Git`相关指令可以实现本地项目上传至远程仓库，也可以实现从远程仓库中拉项目到本地文件夹中，具体流程图如下：![Git工作流程图](https://img.hoi3vel.cn/tech/git_01.webp)

## 2.Git文件状态
**Git**文件拥有4种状态：
1.**Untracked**: 这代表此文件在**Workspace**中但并未加到暂存区中；
2.**Unmodified**: 这代表该文件已加入到**本地仓库**且此文件版本与**Workspace**中文件版本一致。可使用`git rm --cached <fileName>`命令将其仅从本地仓库中删除，但是不会影响工作区间中的原文件。
3.**Modified**: 这代表该文件版本已改变但并未放入暂存区中。此时有两种操作：①使用`git add <fileName>`命令将其放入暂存区；②使用`git restore <fileName>`命令将本地仓库中前版本同名文件调出进而对**Workspace**中的同名文件进行覆盖(即丢弃当前修改)。
4.**Staged**: 这代表此文件已经放入暂存区中。此时仍有两种操作：①使用`git commit -m "Tips"`将其放入本地仓库中，此时本地仓库文件和工作区文件版本一致，此文件状态将转换为**Unmodified**；②使用`git reset <fileName>`命令取消暂存，此时**Workspace**同名文件状态转化为**Modified**。

## 3.忽略文件
**Git**中忽略文件名为`.gitignore`，位于**Workspace**中。其用途简单来说就是避免不必要的文件上传至远程仓库中。`.gitignore`文件规则如下：
- 忽略文件中的空行或以“#”开始的行会被忽略；
- 可以使用Linux通配符。例如，“*”代表任意多字符、“？”代表一个字符、“[]”代表可选字符范围、“{}”代表可选字符串等；
- 若名称的最前面有“!”，表示例外规则，将不被忽略；
- 若名称的最前面有“/”，表示要忽略的文件或文件夹在此目录下，而其它子目录下的同名文件或文件夹则不会被忽略；
- 若名称的最后有“/”，表示要忽略所有目录下的同名目录，同名文件则不会忽略。

**注意:** "temp/*.txt"则代表忽略所有"temp/"目录下直属txt文件，但是"temp/sub/"中的txt文件则不会被忽略。

# 二、使用流程
## 1.初始化工作间(Workspace)
```Shell
# 在当前目录新建一个Git代码库
$ git init

# 新建一个目录，将其初始化为Git代码库
$ git init [project-name]

# 下载一个项目和它的整个代码历史
$ git clone [url]
```

## 2.全局配置
首先要进行**SSH Key**配置。只有在远端仓库添加了本地生成的**SSH Key**才能实现在本地与远端仓库的文件拉取。
```Shell
# 1.生成本地SSH Key
$ ssh-keygen -t rsa -C "邮箱地址"

# 2.查看本地SSH Key， 通常在"C/users/用户名/.ssh/"文件夹中，之后再把此文件内容粘贴到远程仓库中
$ cat ~/.ssh/id_rsa.pub
```
**Git**的设置文件为`.gitconfig`，它可以在用户主目录下(全局配置)，也可以在项目目录下(项目配置)。
```Shell
# 显示当前的Git配置
$ git config --list

# 编辑Git配置文件
$ git config -e [--global]

# 设置提交代码时的用户信息
$ git config [--global] user.name "用户名"
$ git config [--global] user.email "邮箱地址"
```
## 3.项目提交
```Shell
# 将项目所有文件(.)添加至暂存区
$ git add .

# 将项目指定文件或文件夹添加至暂存区
$ git add fileName1 fileName2 ...

# 将暂存区文件添加至本地仓库
$ git commit -m "备注内容"

# 将文件推送至本地仓库，常用命令“git push origin main”
$ git push 仓库名 分支名
```

# 三、其它常用命令
## 1.分支操作
```Shell
# 列出所有分支
$ git branch

# 列出所有远程分支
$ git branch -r

# 新建一个分支但仍然要停留在当前分支
$ git branch 分支名

# 新建一个分支并切换到新分支
$ git checkout -b 分支名

# 合并指定分支到当前分支
$ git merge 指定分支名

# 删除分支
$ git branch -d 分支名

# 删除远程分支
$ git push origin --delete 远程分支名 || git branch -dr 远程仓库/分支名
```
## 2.远程同步
```Shell
# 显示当前origin所指向的远程仓库
$ git remote -v

# 更改origin所指向的远程仓库
$ git remote set-url origin 新远程仓库地址

# 显示某个远程仓库的信息
$ git remote show 远程仓库

# 上传本地指定分支到远程仓库
$ git push 远程仓库 本地分支名

# 强行推送当前分支到远程仓库
$ git push 远程仓库 --force
```
## 3.其它
详情请见网址[Git 大全 - Gitee.com](https://gitee.com/all-about-git)