---
title: Windows下安装Pytorch教程
date: 2025/02/09 14:46:00
updated: 2025/11/21 21:32:00
categories: ['Tech']
tags: ['Machine Learning', 'Pytorch', 'Windows']
leftbar: [related, recent]
topic: Env-Deploy
---
>最近在准备机器学习项目时，关于如何配置Pytorch运行环境问题忙活了好久，网上的教程也不尽人意，因此写下此篇文章方便以后自己回顾，也希望帮助跟我有同样困惑的小伙伴们。
<!-- more -->

## 一、写在前面
本篇教程电脑配置如下：
- 操作系统: Windows 11
- 显卡版本(独显): NVIDIA GeForce RTX 2060
- Python: 3.9.12
- Anaconda: Anaconda3 2022.05

若电脑与上配置不同则在后续步骤中软件版本选择需要依据自身电脑做出改变。

## 二、环境配置
### 2.1 安装Anaconda
Anaconda最大的优点是可以建立很多个独立Python版本的虚拟库环境，这极大方便了多个项目的环境切换。Anaconda版本选择无关紧要，它只决定默认环境(即**base**环境)的Python版本，而后续每个虚拟环境的Python版本可以由开发者自行决定。[Anaconda官方下载链接](https://www.anaconda.com/)

### 2.2 安装CUDA Toolkit
> CUDA(Compute Unified Device Architecture): NAVIDIA开发用于NAVIDIA GPU并行计算的并行计算架构和编程模型。它是一种硬件架构，定义了GPU的并行计算单元、内存架构、线程模型等。
> CUDA Toolkit: NAVIDIA提供用于GPU加速计算的开发工具包，用于支持CUDA架构的并行计算。它是一套软件工具，包含了一系列的工具、库和示例代码，用于开发、优化和部署基于CUDA的并行计算应用程序。
- GPU需要与CUDA结合才能完成模型训练、Pytorch安装等任务
- 若没有CUDA, GPU在深度学习中就是个摆设
- GPU(独显)推理速度是CPU(核显)的几十倍

正确安装CUDA Toolkit需要三个条件：①确定显卡算力；②确定CUDA Runtime Version(即CUDA SDK)；③确定CUDA Driver Version；三者对应的关系应为：显卡算力<=CUDA Runtime Version<=CUDA Driver version

1.查看电脑显卡型号
打开任务管理器->点击`性能`->选择`GPU0`，在右上角即可显示当前电脑显卡型号。Ps: 若电脑配有显卡则有两个GPU，其中一个是核显即镶嵌在CPU中，厂家为CPU厂家，另一个则为独显，厂家为NVIDIA。具体视图如下：![查看显卡型号](https://img.hoi3vel.cn/tech/get_gpu.webp)

2.确定显卡算力以及确定CUDA Runtime Version
知道显卡类型后，前往[网站](https://en.wikipedia.org/wiki/CUDA)找到自己显卡版本所支持的算力。此电脑查询结果如下：![获取显卡算力](https://img.hoi3vel.cn/tech/get_gpu_compute.webp)
RTX 2060显卡算力为7.5，因此我们选择CUDA SDK支持算力区间包含7.5的版本即CUDA SDK>=11.0.
![获取CUDA SDK版本](https://img.hoi3vel.cn/tech/get_gpu_sdk.webp)

3.确定CUDA Driver Version
执行`win+r`输入`cmd`打开shell命令窗口，输入`nvidia-smi`命令，将会显示当前电脑所支持的CUDA版本。具体视图如下：![查看CUDA型号](https://img.hoi3vel.cn/tech/get_cuda.webp)

最终我们确定CUDA Toolkit的版本区间应该为11.0-12.1。前往[CUDA官网](https://developer.nvidia.com/cuda-toolkit-archive)下载指定版本的CUDA Toolkit。安装完成后重启电脑，之后在shell窗口中输入指令`nvcc -V`检验是否安装成功。![CUDA安装成功截图](https://img.hoi3vel.cn/tech/cuda_install_finish.webp)
若出现如上结果则安装成功。

### 2.3 安装Pytorch
前往[Pytorch官网](https://pytorch.org/get-started/previous-versions/)下载与**CUDA Toolkit版本**相对应的Pytorch版本，可采用`conda指令`或者`pip指令`安装，推荐采用`conda指令`安装。注意：OSX栏里的指令安装核显(即CPU)版的Pytorch，而Linux and Windows栏里的指令安装独显(即GPU)版的Pytorch。
安装完成后，打开anaconda中对应虚拟环境的命令行输入指令`conda list`，若出现pytorch则说明安装成功。如图：![Pytorch安装成功截图](https://img.hoi3vel.cn/tech/get_pytorch.webp)

## 三、最后的话
如果以上环境配置完成，编写如下**python脚本**：
```Python
import torch

print(torch.cuda.is_available())
```
若运行结果为**true**，则说明Pytorch可正常使用主机显卡，否则需要检查CUDA Toolkit版本软件以及Pytorch软件版本重新进行适配安装。最后祝愿每一个科研人能够学有所成。