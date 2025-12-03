---
title: C语言中函数间动态内存的传递
date: 2024/09/08 10:23:00
updated: 2025/11/21 21:30:00
categories: ['Tech']
tags: ['C', 'Dynamic Memory']
leftbar: [related, recent]
topic: Algorithm
---
> 在编程实现从字符串提取连续的数字时，发现在函数内申请的动态内存无法传递到main函数中使用，基于此写下这篇文章，探究C语言中函数间动态内存的传递方式。
<!-- more -->

## 一、写在前面
C语言中，动态申请的内存划分在堆中，其生存周期与程序生存周期一致，系统不会自动回收，需要程序员调用free()函数手动调用。既然如此，如果在函数中申请一个动态内存，那么如何在main函数中调用呢？

## 二、具体实例
### 1.错误实例
有如下代码：
```C
#include<stdio.h>
#include<stdlib.h>

void Func(int a[], int n)
{
    a = (int*)malloc(sizeof(int)*n);
    for(int i=0; i<n; i++) a[i] = i;
}

int main()
{
    int n = 5, *a = NULL;
    Func(a, n);
    if(!a) printf("a is null!\n");
    else
    {
        for(int i=0; i<n; i++) printf("%d ", a[i]);
    }

    return 0;
}
```
上述代码中，在Func()函数中对a数组进行了动态内存申请，在main()函数中进行调用，程序运行结果为`a is null!`。造成这种结果是因为此时函数传递方式为值传递，这意味着将指针a传递给函数Func()时，实际上是传递了一个a的副本即当在Func()函数内为a分配内存时，实际上在修改a的副本而不是main()函数中的a。
### 2.正确实例
在C语言中，函数之间的动态内存传递方式主要有两种：①使用函数传参的方式。此时形参必须为**双维指针**，否则函数内分配的动态内存无法传入至主函数中。②采用函数返回值的形式，返回值为**单维指针**。
```C
// 方式一：函数传参
#include<stdio.h>
#include<stdlib.h>

void Func(int **a, int n)
{
    *a = (int*)malloc(sizeof(int)*n);
    for(int i=0; i<n; i++) (*a)[i] = i;
}

int main()
{
    int n = 5, *a = NULL;
    Func(&a, n);
    if(!a) printf("a is null!\n");
    else
    {
        for(int i=0; i<n; i++) printf("%d ", a[i]);
    }

    return 0;
}
```
```C
// 方式二: 函数返回值
#include<stdio.h>
#include<stdlib.h>

int* Func(int n)
{
    int *temp = (int*)malloc(sizeof(int)*n);
    for(int i=0; i<n; i++) temp[i] = i;
    return temp;
}

int main()
{
    int n = 5, *a = NULL;
    a = Func(n);
    if(!a) printf("a is null!\n");
    else
    {
        for(int i=0; i<n; i++) printf("%d ", a[i]);
    }

    return 0;
}
```

## 三、题外话
在C语言中动态内存的申请可采用malloc()和realloc()函数，前者仅需要传递一个函数参数即需要的内存大小，而后者则需要传递两个函数参数即realloc(ptr, size)，ptr为目的函数指针，成功时返回指向新内存块的指针且原内存将会释放；失败时返回NULL且原指针ptr指向的内存块仍然有效。若ptr为空指针，则该函数效果同malloc()函数。
实际上，realloc()函数用于对已分配内存的扩展，其扩展机制如下：
- 若ptr所指的位置可以继续找到足够的连续内存空间，则该函数会直接在原有内存块的基础上扩展内存。此时返回的地址为ptr原地址；
- 若原位置不能扩展，则该函数会在堆中新寻找一个合适的位置并将原内存块的数据复制到新位置以及**释放原有内存块**。