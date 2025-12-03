---
title: 数组中的字符串匹配
date: 2025/01/20 20:56:00
updated: 2025/11/21 21:33:00
categories: ['Tech']
tags: ['C', 'Simple Matching']
leftbar: [related, recent]
topic: Algorithm
---
> 今天刷Leetcode时，一道字符串匹配的题目卡了好久好久，后来才想到这是数据结构中串的朴素匹配算法的应用，因此写下此篇文章方便日后复习。
<!-- more -->

## 一、写在前面
数据结构中，朴素匹配算法是一种简单而有效的字符串匹配方法，也被称为暴力搜索方法。它的基本思想是逐个比较主字符串和模式串的每个字符，以此确定是否存在匹配。

## 二、具体题目
有一个字符串数组**words**,数组中的每个字符串都可以看作是一个单词。请你按照**任意**顺序返回words中是其他单词的子字符串的所有单词。（Ps: 如果你可以删除`words[j]`最左侧或最右侧的若干字符得到`words[i]`，那么字符串`words[i]`就是`word[j]`的子字符串）

示例1:
- 输入：words = ["mass","as","hero","superhero"]
- 输出：["as","hero"]
- 解释："as" 是 "mass" 的子字符串，"hero" 是 "superhero" 的子字符串。因此["hero","as"]是最终答案。

示例2:
- 输入：words = ["leetcode","et","code"]
- 输出：["et","code"]
- 解释："et" 和 "code" 都是 "leetcode" 的子字符串。因此最终答案为["et", "code"]

示例3:
- 输入：words = ["blue","green","bu"]
- 输出：[]

[Leetcode原题](https://leetcode.cn/problems/string-matching-in-an-array/description/)

## 三、思路分析
此题关键是编写判断一个字符串(str1)是否是另一个字符串(str2)的子字符串的函数，对此有两种算法可以解决：①简单朴素匹配算法；②KMP算法。由于KMP算法需要构建**next**数组较为复杂，因此解此题采用**简单朴素匹配算法**。将**str1**作为模式串，**str2**作为主字符串，通过遍历主字符串统计与模式串匹配个数，若匹配个数与模式串长度相等则匹配成功，否则匹配失败。（注：每一次单字符匹配失败都需置匹配统计量为0）
具体代码如下：
```C
int isSub(char *str1, char *str2) { //判断str1是否为str2的子字符串
	if(strlen(str1) > strlen(str2)) return 0;
	else {
//		int match = 0;
		for(int i=0; i<strlen(str2); i++) {
			int match = 0;
			if(str1[match] == str2[i]) {
				for(int j=i; j<strlen(str2); j++) {
					if(str1[match]==str2[j]){
						match++;
						if(match == strlen(str1)) return 1;	
					}else {
						match = 0;
						break;
					}
				}
			}
		}
	}
	return 0;
}
```
```C
char** stringMatching(char **words, int wordsSize, int* returnSize) {  // 获取words数组中的子字符串
    int len = 0;
    char **ans = NULL;
	for(int i=0; i<wordsSize; i++) {
    	for(int j=0; j<wordsSize; j++) {
    		if(i==j) continue;
    		else {
    			if(isSub(words[i], words[j])) {
    				len++;
    				ans = (char**)realloc(ans, sizeof(char*)*len);
    				ans[len-1] = (char*)malloc(sizeof(char)*(strlen(words[i])+1));
    				strcpy(ans[len-1], words[i]);
    				break;
				}
			}
		}
	}
	*returnSize = len;
	return ans;
}
```

## 四、题外话
此题解法建立在以下条件下：
- 1 <= words.length <= 100
- 1 <= words[i].length <= 30
- `words[i]`仅包含小写英文字母。
- 题目数据保证每个`words[i]`都是独一无二的。

若无此限制，采用简单朴素匹配算法可能会超时。
