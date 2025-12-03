---
title: '基于Hexo的静态博客部署至阿里云服务器'
date: 2024/05/29 17:00:00
updated: 2025/11/21 21:26:00
categories: ['Tech']
tags: ['Cloud Server', 'Deployment', 'Hexo', 'Guidance']
leftbar: [related, recent]
topic: Env-Deploy
---
> 自己将本地博客部署到阿里云服务器过程中踩了许许多多的坑，网上的许多教程也不尽人意，因此写下这篇如何将本地博客部署至阿里云服务器的教程博客，希望对有此需求的人有所帮助。
<!--more -->

## 一、写在前面
### 1.部署方式
博客部署有两种选择：
- 托管至GitHub或者Gitee上: 借用Github或Gitee的这一功能部署网站，操作简单且免费。国内访问速度方面Gitee>Github。
- 部署至私有云服务器上：需要花钱购买服务器、域名，此方式自主性强且相应速度快。
在此文章中我将叙述如何将本地的Hexo静态博客部署至私有云服务器上。

### 2.相关环境
- 阿里云服务器: ①CPU&内存-2核(vCPU) 2GiB; ②操作系统: Ubuntu 20.04 64位; ③公网带宽: 3Mbps
- Nodejs版本(云服务器上):  v20.13.1
- Git版本(云服务器上): v2.25.1
- Nginx版本(云服务器上): v1.18.0(Ubuntu)
### 3.前置准备
- 本地成功搭建Hexo博客
- 本地成功安装了Git工具
- 域名与云服务器公有Ip实现映射绑定

## 二、工作原理
本地撰写的博客会保存在source目录内，当我们输入`hexo generate`命令时，Hexo将会把我们写的Markdown文件渲染成静态文件(即网页文件)，输入`hexo deploy`时，Hexo会通过我们的配置好的免密登陆连接至服务器并将生成的静态文件推送至服务器的Git仓库内。当Git仓库内容发生变更时则会触发钩子文件进而将仓库内的内容部署至网站根目录下。
此外我们还需要配置好Nginx服务和域名解析，这样当用户访问我们博客的域名时，域名将会被重定向为云服务的公有Ip地址并通过Nginx服务访问网站根目录里的静态文件。相关流程图如下所示:![部署流程图](https://img.hoi3vel.cn/tech/hexo_depoly.webp)

## 三、搭建步骤(针对云服务器)
### 1.服务端初始配置
- 前往阿里云网站的控制台，记录云服务器的公网Ip: 控制台->云服务器ESC->公网Ip
- 设置阿里云服务器安全组：需要开放80端口(HTTP默认访问端口)、443端口(HTTPS默认访问端口)以及22端口。具体如下图:![安全组图](https://img.hoi3vel.cn/tech/security_group.webp)
- 重置服务器登陆密码，用于远程云登陆服务器：控制台->云服务ESC->服务器实例->全部操作(右上角)->重置实例密码
### 2.远程登陆服务器
- 打开Xshell并新建会话：①协议：SSH; ②主机: 云服务器公网Ip; ③端口号: 22
- 点击连接：①用户名: root; ②密码: 即上述重置服务器登陆密码时输入的密码
- 登陆成功后终端显示如下图:![Xshell_Connect](https://img.hoi3vel.cn/tech/Xshell_Connect.webp)
### 3.创建Hexo部署目录
Hexo部署目录实质就是云服务器中存放博客的位置。使用Xshell成功连接远程服务器后输入如下命令:
```Shell
mkdir -p /data/blog # 注意这个路径可按照自定义来
```
### 4.安装Nodejs
- 在Xshell终端输入如下命令:
```Shell
sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
```

- 成功安装后依次输入命令: `node -v`和`npm -v`，若可显示相应版本号则说明安装成功
PS:上述命令安装的Nodejs版本为**v20.13.1**，如需要安装其他版本则可从[NodeSource](https://github.com/nodesource/distributions)安装
### 5.安装Git
- 在Xshell终端输入命令: `sudo apt-get install git-core`

- 成功安装后输入命令: `git --version`，若可显示其版本号则说明安装成功

### 6.安装Nginx
- 在Xshell终端输入命令: `sudo apt install nginx -y`

- 成功安装后输入命令: `nginx -v`，若可显示版本号则说明安装成功

- 启动Nginx服务：`systemctl start nginx.service`

- 查看Nginx服务运行状态: `systemctl status nginx`，若出现<font color='green'>active</font>字样则说明Nginx服务启动成功

### 7.配置Nginx
- 查看**nginx.conf**文件位置: `nginx -t`,一般为'/etc/nginx/nginx.conf'

- 修改**nginx.conf**文件: `nano /etc/nginx/nginx.conf`，在**http**模块中添加如下代码：
```Txt
server {
    listen 80;
    server_name 域名;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name 域名;
    # 证书文件名称pem文件
    ssl_certificate /xxx/xxx/域名.pem;
    # 证书私钥文件名称key文件
    ssl_certificate_key /xxx/xxx/域名.key;
    # ssl验证配置 缓存有效期
    ssl_session_timeout 5m;
    # 安全链接可选的加密协议
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    # 配置加密套件和/加密算法
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    # 使用服务器端的首选算法
    ssl_prefer_server_ciphers on;

    # 指定虚拟主机根目录
    location / {
        root /data/blog; # root后路径为Hexo在云服务器的部署目录
        index index.html index.htm;
    }
}
```
Ps: ssl证书可从域名购买平台上申请，然后下载上传至云服务器自定义位置即可

### 8.添加git用户
- **root**用户默认的权限过大，处于安全考虑为云服务器添加名为git的用户，用于将博客自动部署至云服务器上
```Shell
useradd git # 添加名为git的用户
passwd xxx # 修改git用户的密码
```

- 为git用户授予sudo权限，执行`nano /etc/sudoers`，在`root ALL=(ALL:ALL) ALL`语句下添加`git ALL=(ALL:ALL) ALL`

### 9.为git用户添加SSH密钥
目前为止，对git仓库进行的所有操作都需要输入密码，我们可以通过为git用户添加SSH密钥的方式来实现免密登录。原理：在本地生成一对密钥文件（分别是公钥和私钥），将公钥文件上传到服务器上；服务器收到连接请求时，会将本地的公钥与服务器的公钥进行比对，用私钥解密服务器发来的一段信息并将其发回，验证通过后准许连接。
- 在**本地计算机**上打开Git Bush执行命令: `ssh-keygen -t rsa`，生成密钥对。运行完后可在'C:\Users\用户名\.ssh'文件下找到'id_rsa'和'id_rsa.pub'文件，前者为私钥文件，后者为公钥文件

- 在Xshell终端先执行`makdir -p /home/git/.ssh`，后执行`cd /home/git/.ssh`以及`nano authorized_keys`，输入内容为**'id_rsa.pub'**文件内容

- 在Xshell终端中执行如下代码：
```Shell
su root # 从git用户更换至root用户
chmod 600 /home/git/.ssh/authorized_keys
chmod 700 /home/git/.ssh
```

- 将.ssh文件夹及其内的所有文件所有权转交给git用户: `chown -R git:git /home/git/.ssh`

- 在**本地计算机**测试是否可以用ssh免密登录服务器，在Git Bash中执行`ssh -v git@xxx.xxx.xxx.xxx`(Ps:git@后填写服务器的公网Ip) ,若成功则会出现'Welcome to Alibaba Cloud Elastic Compute Service !'提示语。

### 10.创建Git仓库并配置自动部署
这里的Git仓库（repository）可以理解为一个存放着不同版本代码的代码库，包含了项目所有的源文件和版本控制信息。但我们在这里需要用到的是裸库，即仅包含版本控制信息的仓库。后者不保存文件，常用作服务器仓库，实现数据共享和同步。自动部署的核心在于git-hooks（钩子），可以理解为一种脚本，在特定条件下触发时会调用钩子并执行钩子文件中的内容。
- Xshell切换到**root**用户，新建目录并在该目录下创建Git仓库
```Shell
cd /home/git
git init --bare blog.git # 创建一个名为blog的仓库，--bare参数为创建裸库
```

- 打开'/home/git/blog.git/hooks'目录下的**post-receive**钩子文件(若无则新建)，往其添加内容`git --work-tree=/data/blog --git-dir=/home/git/blog.git checkout -f`。(Ps:work-tree填写Hexo部署目录，git-dir填写Git仓库的目录)

- 为钩子文件及Git仓库目录配置权限。这里需要将我们创建的仓库及部署目录的所有权移交给git用户，因为Linux下创建文件时默认只有拥有者（即创建者）才具有读写权限，而Git进行push操作时登录的用户为git用户。
```Shell
chmod +x /home/git/blog.git/hooks/post-receive     #为钩子文件授予可执行权限（+x）
chown -R git:git /home/git    #将仓库目录的所有权移交给git用户
chown -R git:git /data/blog     #将Hexo部署目录的所有权移交给git用户
```
### 11.在本地计算机中更改本地博客部署路径
- 打开本地计算机的Hexo文件夹，在**\_config.yml**文件中找到deploy语句并进行如下修改：
```Txt
deploy:
    type: git
    repository: git@xxx.xxx.xxx.xxx:/home/git/blog.git # git@云服务器公网Ip:云服务器Git仓库地址
    branch: master
```

- 依次执行命令`hexo clean`、`hexo generate`、`hexo deploy`并对云服务器'/data/blog'目录刷新，若有文件出现(该目录原为空目录)则说明博客已成功部署至云服务器上，至此可以在浏览器中输入域名来访问博客站点。(Ps：若域名未与公网Ip绑定<即域名解析>，则无法实现输入域名访问博客站点)