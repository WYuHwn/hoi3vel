---
title: 淘宝电商平台商品信息爬取
date: 2025/04/18 14:41:00
updated: 2025/11/21 21:33:00
categories: ['Tech']
tags: ['Python', 'Web Crawler']
leftbar: [related, recent]
topic: Major
---
> 为了之后的研究生生活，最近开始学习Python这门语言。刚刚过完了一遍Python基础语法，可是脑子还是感觉空空的。太难的项目暂时又写不出来，于是便尝试编写一个简单的爬虫程序，一是为了巩固Python基础，二是重新拾起爬虫的相关知识。本篇文章基于淘宝电商平台编写爬取电脑商品信息的爬虫程序。
<!-- more -->

## 一、写在前面
爬虫(Web Crawler)是一种基于规则对网络中文本、图片等信息进行自动爬取的程序。其主要思想是通过模拟真实用户，向服务器发送请求进而持续对网页数据进行抓取，直到达到某一条件时停止。
本篇教程相关环境如下:
- Python 3.10.11
- requets模块 2.31.0

## 二、关键步骤
爬虫基本工作流程主要有三个：①明确需求——要采集的网站地址以及目标数据内容；②抓包分析——打开浏览器自带的开发者工具获取包数据网址；③按指定需求对数据进行处理；
### 1.导入相关模块
```Python
import requests
import json
import re
import hashlib
import csv
import time
```
- requests模块: 用于发送HTTP请求(get/post)
- json模块: 数据一般存储在JSON文件中，而该模块可实现将JSON数据转化为Python中的字典类型，方便数据处理
- re模块: 该模块支持使用正则表达式对文本内容的提取，方便数据处理
- hashlib模块: 存放MD5等数据加密函数，用于淘宝平台中**Sign**参数的加密逆向分析
- csv模块: 类似Excel表格，用于数据保存
- time模块: Python内置时间模块，用于获取时间戳以及模拟用户浏览操作

### 2.模拟浏览器
```Python
headers = {
    'cookie': 'cna=zyCGIBdAVWICAXjHIncvopiS; thw=cn; t=b218f49912339b0ceae556e0090e211b; xlly_s=1; _tb_token_=7a5b15963ff84; cookie2=16651aea2c313a912b01cb164e4e08a0; 3PcFlag=1744784663786; _hvn_lgc_=0; cookie3_bak=16651aea2c313a912b01cb164e4e08a0; unb=3971315337; lgc=%5Cu4E00%5Cu8F6E%5Cu5F2F%5Cu6708%5Cu4E00%5Cu7F15%5Cu76F8%5Cu601D; cancelledSubSites=empty; env_bak=FM%2Bgnk3pmwgJGNrZ6%2FSkIJoxCwTm6VI1qZ6TClrxgOc3; cookie17=UNkwcc4KQQFHcg%3D%3D; dnk=hoi3vel; tracknick=%5Cu4E00%5Cu8F6E%5Cu5F2F%5Cu6708%5Cu4E00%5Cu7F15%5Cu76F8%5Cu601D; _l_g_=Ug%3D%3D; sg=%E6%80%9D74; _nk_=%5Cu4E00%5Cu8F6E%5Cu5F2F%5Cu6708%5Cu4E00%5Cu7F15%5Cu76F8%5Cu601D; cookie1=U%2BIlWIeHLSADvBxDCm0kQKQsca6SNqfz%2FIpTHfq3ZQw%3D; sgcookie=E1003OSkTgC9VlYpf2%2FnITYkh7VA%2BCuHtM4rpO%2B0DYpiEHhSZi8%2B46SUAIXRls1C9TuK6mE77ohQhH3D7Vr1b4um%2BPEe%2BqJJGCi4WxE%2BQnQE0fQ%3D; havana_lgc2_0=eyJoaWQiOjM5NzEzMTUzMzcsInNnIjoiYWU2MzZmZDI5YjQ2MDNlNGUxMGU1YTkyYThhNjYyOTEiLCJzaXRlIjowLCJ0b2tlbiI6IjFjUWNFWDNhWm9oMl9BMHFTMzRtNUhnIn0; havana_lgc_exp=1775888706045; cookie3_bak_exp=1745043906045; wk_cookie2=1b3ee28d98c093084dd38ee1285362b2; wk_unb=UNkwcc4KQQFHcg%3D%3D; uc1=cookie16=U%2BGCWk%2F74Mx5tgzv3dWpnhjPaQ%3D%3D&pas=0&cookie14=UoYaj4%2Bx2t0h1w%3D%3D&existShop=false&cookie15=V32FPkk%2Fw0dUvg%3D%3D&cookie21=URm48syIYB3rzvI4Dim4; sn=; uc3=id2=UNkwcc4KQQFHcg%3D%3D&nk2=saDbd13P348Tq%2FXU0Jk%2FOg%3D%3D&vt3=F8dD2EuMY7YkvXA3Qzs%3D&lg2=VT5L2FSpMGV7TQ%3D%3D; csg=b9bc66e6; skt=ce2a91bede66482d; existShop=MTc0NDc4NDcwNg%3D%3D; uc4=nk4=0%40s8Wb7PJZDAD5%2BPfdt88U4O4L5YsttBggT1RI&id4=0%40Ug46vpy6gA%2FUJ82j39S%2FC20NcRKR; _cc_=VFC%2FuZ9ajQ%3D%3D; _samesite_flag_=true; havana_sdkSilent=1744958760754; sdkSilent=1744970016688; mtop_partitioned_detect=1; _m_h5_tk=bd25aec960a5af5dae87a57bd23a76fe_1744909656357; _m_h5_tk_enc=ffb07dba49e6d2242032897636cd438c; tfstk=gGwrwi1R4TBPOMu-Z-Me_JQFb_H-Bv71UJgIxkqnV40oPkmnLr4C24ZhyyyEokF52X_JY3e47p95y_EHLvMh5N61CuESpvbsLYD804nLm2jjZUroe3Dh5N6XGncRPv4CcYla3Imto0mnqXjqnDmiKLcu-qcmjcToKy4nmjmIj30nZvcDiqnnK24nKikmkDMn-jUK-V9qbbjImYz_o14iaVqoudrY30Dewu02Kp24gbuMCqJHK-oucQngid5IS53S12zchLkUmDzq177wUyr3XWc4LUj7SrVU-mFA8BuatuNTtjSlEokrzjo7lhAqUW48LbFyvGEmErFtWbfAkmy7CXutgEbucouo_Wz5kp07_o4q1-TXCAVTuJliIg8JJm4GYJFy-BloDmu10ir891NT8FfC5BdKwSnq5gIJ9BhoDmu10iRp9bHx0VsR2; isg=BEJCPyO0nhwnFY2-jgYMqgg3k0ikE0YtYJe0OYxbdrVg3-JZdKCMPZIZj9ujiL7F',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
}

```
- cookie参数: 存放用户信息，用于检测是否有登录账号信息(登录与否都有相关信息)
- user-agent参数: 用户代理，表示访问设备的基本信息

两个参数获取途径如下：
①打开淘宝平台点击[电脑区](https://s.taobao.com/search?page=1&q=%E7%94%B5%E8%84%91&spm=a21bo.jianhua%2Fa.201867-main.d2_first.5af92a89pa9CHZ&tab=all)页面；

②**F2**或鼠标右键点击**检查**打开浏览器开发者工具。开发者工具界面如图：![开发者工具](https://img.hoi3vel.cn/tech/2025_04_18_02_01.webp)

③在开发者工具中选择 **网络(network)** 并刷新页面。操作如图：![02_02](https://img.hoi3vel.cn/tech/2025_04_18_02_02.webp)

④在开发者工具搜索栏中搜索任意商品名获取商品信息对应的JSON文件，点击搜索内容自动跳转至对应JSON文件，点击**标头**即可在此页面中依次找到cookie和user-agent参数。操作如图：![02_03](https://img.hoi3vel.cn/tech/2025_04_18_02_03.webp)

### 3.获取数据包请求地址
```Python
url = 'https://h5api.m.taobao.com/h5/mtop.relationrecommend.wirelessrecommend.recommend/2.0/?'
```
**Get**请求的url地址参数直接在链接中(即?后部分)，通常有两种构造形式：①直接将请求地址存储在一个变量中；②额外构建查询参数请求(链接参数过长时使用)；
![03_01](https://img.hoi3vel.cn/tech/2025_04_18_03_01.webp)在上图中，序号2地址即为完整数据包请求地址，序号1即为不带参数的数据包请求地址，此时需要额外构建查询请求参数。查询参数可在开发者工具中**载荷**页面查看，如图：![03_02](https://img.hoi3vel.cn/tech/2025_04_18_03_02.webp)

```Python
# 构建查询参数
url_params = {
    'jsv': '2.7.4',
    'appKey': '12574478',
    't': eT,
    'sign': sign,
    'api': 'mtop.relationrecommend.wirelessrecommend.recommend',
    'v': '2.0',
    'type': 'jsonp',
    'dataType': 'jsonp',
    'callback': 'mtopjsonp5',
    'data': ep_data,
}
```
在上述代码中，`t`、`sign`和`data`是实时参数，因此需要根据时间戳随时变化。

### 4.查询参数Sign的逆向解密
淘宝平台的`sign`参数采用了MD5进行加密，此时我们需要对其解密。而解密的关键则是获取淘宝`sign`加密参数。获取思路则是通过在开发者工具搜索`sign:`找到相应的`main.js`文件并在**“来源”**面板中打开。如下图：![04_01](https://img.hoi3vel.cn/tech/2025_04_18_04_01.webp)

在来源面板中`Ctr+F`打开搜索按钮，输入`sign:`进行查询。如下图：![04_02](https://img.hoi3vel.cn/tech/2025_04_18_04_02.webp)上图蓝色处即为断点也是淘宝`sign`加密参数即`eE(em.token + "&" + eT + "&" + eC + "&" + ep.data)`。其中`eT`为时间戳，可用time模块进行模拟，而`em.token`、`eC`和`ep.data`参数可在控制台中输入相关参数进行获取对应的值。如下图: ![04_03](https://img.hoi3vel.cn/tech/2025_04_18_04_03.webp)
需要注意的`ep.data`参数中有些参数随着浏览页码的改变而改变，具体有`page`、`totalResults`、`sourceS`、`bcoffset`以及`ntoffset`参数，这些参数存放在上页JSON文件数据中。

### 5.查找JSON文件中的目标数据位置
在开发者工具中点击**网络(network)**模块，并搜索任意商品数据定位至指定JSON数据文件，在**预览**块中可查看目标数据。如下图: ![05_01](https://img.hoi3vel.cn/tech/2025_04_18_05_01.webp)

## 三、具体实现代码
```Python
import requests
import json
import re
import hashlib
import csv
import time

'''Sign加密逆向分析
    eE(em.token + "&" + eT + "&" + eC + "&" + ep.data)
    eT--时间戳, eC--appKey
'''
def getSign(eT, page, totalResults, sourceS, bc_offset, nt_offset):
    em_token = 'bd25aec960a5af5dae87a57bd23a76fe' # 固定一个
    eC = '12574478' # 固定
    sign_params = {
        "device": "HMA - AL00 ",
        "isBeta": "false",
        "grayHair": "false",
        "from": "nt_history",
        "brand": "HUAWEI",
        "info": "wifi",
        "index": "4",
        "rainbow": "",
        "schemaType": "auction",
        "elderHome": "false",
        "isEnterSrpSearch": "true",
        "newSearch": "false",
        "network": "wifi",
        "subtype": "",
        "hasPreposeFilter": "false",
        "prepositionVersion": "v2",
        "client_os": "Android ",
        "gpsEnabled":"false",
        "searchDoorFrom": "srp",
        "debug_rerankNewOpenCard": "false",
        "homePageVersion": "v7",
        "searchElderHomeOpen": "false",
        "search_action": "initiative",
        "sugg": "_4_1",
        "sversion": "13.6",
        "style": "list",
        "ttid": "600000@taobao_pc_10.7.0",
        "needTabs": "true",
        "areaCode": "CN",
        "vm": "nw",
        "countryNum": "156",
        "m": "pc",
        "page": page, # 翻页变参数
        "n": 48,
        "q": "%E7%94%B5%E8%84%91",
        "qSource": "url",
        "pageSource": "a21bo.jianhua/a.201867-main.d2_first.5af92a89INtItN",
        "tab": "all",
        "pageSize": "48",
        "totalPage": "100",
        "totalResults": totalResults, # 翻页变参数
        "sourceS": sourceS, # 翻页变参数
        "sort": "_coefp",
        "bcoffset": bc_offset, # 翻页变参数
        "ntoffset": nt_offset, # 翻页变参数
        "filterTag": "",
        "service": "",
        "prop": "",
        "loc": "",
        "start_price": None,
        "end_price": None,
        "startPrice": None,
        "endPrice": None,
        "categoryp": "",
        "ha3Kvpairs": None,
        "myCNA": "zyCGIBdAVWICAXjHIncvopiS",
        "screenResolution": "1536x864",
        "userAgent": "Mozilla/5.0(Windows NT 10.0;Win64;x64)AppleWebKit/537.36(KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "couponUnikey": ""
    }
    info_data = {
        'appId': '34385',
        'params': json.dumps(sign_params) # 序列化处理
    }
    ep_data = json.dumps(info_data).replace(' ', '')
    aim_str = em_token + '&' + str(eT) + '&' + eC + '&' + ep_data
    md5 = hashlib.md5()
    md5.update(aim_str.encode('utf-8'))
    sign = md5.hexdigest()
    return sign, ep_data

'''获取下一页的参数内容
'''
def getNextParams(json_data):
    totalResults = json_data['data']['mainInfo']['totalResults']
    sourceS = json_data['data']['mainInfo']['sourceS']
    bc_offset = json_data['data']['mainInfo']['bcoffset']
    nt_offset = json_data['data']['mainInfo']['ntoffset']
    return totalResults, sourceS, bc_offset, nt_offset

# 1.模拟浏览器
headers = {
    # cookie-用户信息
    'cookie': 'cna=zyCGIBdAVWICAXjHIncvopiS; thw=cn; t=b218f49912339b0ceae556e0090e211b; xlly_s=1; _tb_token_=7a5b15963ff84; cookie2=16651aea2c313a912b01cb164e4e08a0; 3PcFlag=1744784663786; _hvn_lgc_=0; cookie3_bak=16651aea2c313a912b01cb164e4e08a0; unb=3971315337; lgc=%5Cu4E00%5Cu8F6E%5Cu5F2F%5Cu6708%5Cu4E00%5Cu7F15%5Cu76F8%5Cu601D; cancelledSubSites=empty; env_bak=FM%2Bgnk3pmwgJGNrZ6%2FSkIJoxCwTm6VI1qZ6TClrxgOc3; cookie17=UNkwcc4KQQFHcg%3D%3D; dnk=hoi3vel; tracknick=%5Cu4E00%5Cu8F6E%5Cu5F2F%5Cu6708%5Cu4E00%5Cu7F15%5Cu76F8%5Cu601D; _l_g_=Ug%3D%3D; sg=%E6%80%9D74; _nk_=%5Cu4E00%5Cu8F6E%5Cu5F2F%5Cu6708%5Cu4E00%5Cu7F15%5Cu76F8%5Cu601D; cookie1=U%2BIlWIeHLSADvBxDCm0kQKQsca6SNqfz%2FIpTHfq3ZQw%3D; sgcookie=E1003OSkTgC9VlYpf2%2FnITYkh7VA%2BCuHtM4rpO%2B0DYpiEHhSZi8%2B46SUAIXRls1C9TuK6mE77ohQhH3D7Vr1b4um%2BPEe%2BqJJGCi4WxE%2BQnQE0fQ%3D; havana_lgc2_0=eyJoaWQiOjM5NzEzMTUzMzcsInNnIjoiYWU2MzZmZDI5YjQ2MDNlNGUxMGU1YTkyYThhNjYyOTEiLCJzaXRlIjowLCJ0b2tlbiI6IjFjUWNFWDNhWm9oMl9BMHFTMzRtNUhnIn0; havana_lgc_exp=1775888706045; cookie3_bak_exp=1745043906045; wk_cookie2=1b3ee28d98c093084dd38ee1285362b2; wk_unb=UNkwcc4KQQFHcg%3D%3D; uc1=cookie16=U%2BGCWk%2F74Mx5tgzv3dWpnhjPaQ%3D%3D&pas=0&cookie14=UoYaj4%2Bx2t0h1w%3D%3D&existShop=false&cookie15=V32FPkk%2Fw0dUvg%3D%3D&cookie21=URm48syIYB3rzvI4Dim4; sn=; uc3=id2=UNkwcc4KQQFHcg%3D%3D&nk2=saDbd13P348Tq%2FXU0Jk%2FOg%3D%3D&vt3=F8dD2EuMY7YkvXA3Qzs%3D&lg2=VT5L2FSpMGV7TQ%3D%3D; csg=b9bc66e6; skt=ce2a91bede66482d; existShop=MTc0NDc4NDcwNg%3D%3D; uc4=nk4=0%40s8Wb7PJZDAD5%2BPfdt88U4O4L5YsttBggT1RI&id4=0%40Ug46vpy6gA%2FUJ82j39S%2FC20NcRKR; _cc_=VFC%2FuZ9ajQ%3D%3D; _samesite_flag_=true; havana_sdkSilent=1744958760754; sdkSilent=1744970016688; mtop_partitioned_detect=1; _m_h5_tk=bd25aec960a5af5dae87a57bd23a76fe_1744909656357; _m_h5_tk_enc=ffb07dba49e6d2242032897636cd438c; tfstk=gGwrwi1R4TBPOMu-Z-Me_JQFb_H-Bv71UJgIxkqnV40oPkmnLr4C24ZhyyyEokF52X_JY3e47p95y_EHLvMh5N61CuESpvbsLYD804nLm2jjZUroe3Dh5N6XGncRPv4CcYla3Imto0mnqXjqnDmiKLcu-qcmjcToKy4nmjmIj30nZvcDiqnnK24nKikmkDMn-jUK-V9qbbjImYz_o14iaVqoudrY30Dewu02Kp24gbuMCqJHK-oucQngid5IS53S12zchLkUmDzq177wUyr3XWc4LUj7SrVU-mFA8BuatuNTtjSlEokrzjo7lhAqUW48LbFyvGEmErFtWbfAkmy7CXutgEbucouo_Wz5kp07_o4q1-TXCAVTuJliIg8JJm4GYJFy-BloDmu10ir891NT8FfC5BdKwSnq5gIJ9BhoDmu10iRp9bHx0VsR2; isg=BEJCPyO0nhwnFY2-jgYMqgg3k0ikE0YtYJe0OYxbdrVg3-JZdKCMPZIZj9ujiL7F',
    # user-agent-用户代理
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
}

# 2.数据包地址
url = 'https://h5api.m.taobao.com/h5/mtop.relationrecommend.wirelessrecommend.recommend/2.0/?'

# 3.获取时间戳
eT = int(time.time() * 1000) # ms级

# 4.获取加密参数
page = 1
totalResults = 4800
sourceS = '0'
bc_offset = '""'
nt_offset = '""'

# 5.创建文件对象
file = open('C:/Users/Yam/Desktop/Computer.csv', mode='w', encoding='UTF-8-SIG', newline='')
# 字典写入方法
csv_writer = csv.DictWriter(file, fieldnames=['title', 'price', 'real_sale', 'procity', 'store', 'detail'])
# 写入表头
csv_writer.writeheader()

for i in range(25):
    print(f'第{i+1}次爬取...')
    page = i + 1
    sign, ep_data = getSign(eT, page, totalResults, sourceS, bc_offset, nt_offset)
    url_params = {
        'jsv': '2.7.4',
        'appKey': '12574478',
        't': str(eT),
        'sign': sign,
        'api': 'mtop.relationrecommend.wirelessrecommend.recommend',
        'v': '2.0',
        'type': 'jsonp',
        'dataType': 'jsonp',
        'callback': 'mtopjsonp5',
        'data': ep_data,
    }
    # 发送请求
    response = requests.get(url=url, params=url_params, headers=headers)
    goods_info = response.text
    # print(goods_info)
    json_str = re.findall('mtopjsonp\d+\((.*)', goods_info)[0][:-1]
    json_data = json.loads(json_str)
    itemsArray = json_data['data']['itemsArray']
    for item in itemsArray:
        if 'title' not in item.keys():
            continue
        dit = {
            'title': item['title'].replace('<span class=H>', '').replace('</span>', ''),
            'price': item['price'],
            'real_sale': item['realSales'],
            'procity': item['procity'],
            'store': item['shopInfo']['title'],
            'detail': 'https:' + item['auctionURL']
        }
        # 写入数据
        csv_writer.writerow(dit)
    totalResults, sourceS, bc_offset, nt_offset = getNextParams(json_data)
    time.sleep(30) # 睡眠30s
    print(f'第{i+1}次爬取成功!!!')

file.close()
```
上述代码中可变参数需要根据自身设备进行改变!!!