---
title: CMake教程
date: 2025/06/30 13:11:00
updated: 2025/11/21 21:28:00
categories: ['Tech']
tags: ['CMake', 'Guidance']
leftbar: [related, recent]
topic: Major
---
> 自己在使用CLion集成环境编写C++程序时发现其自动生成了CMakeLists.txt文件，通过查阅相关资料发现其跟CMake有关，于是便写下这篇文章进行相关知识记录方便自己复习。
<!-- more -->

# 一、前言
`CMake`是一个支持跨平台的项目构建工具。另外还有一个更为人熟知的项目构建工具——**Makefile**(通过`make`命令进行项目的构建)，然而大多数`IDE`软件都集成了`Make`，比如：`Visual Code`的`nmake`、`Linux`下的`GNU make`以及`QT`的`QMake`等。`Makefile`通常依赖于当前的编译平台，有时程序员编写`Makefile`工作量会比较大且解决依赖关系时也容易出错。而`CMake`恰好能解决上述问题，其允许开发者指定整个工程的编译流程，再根据编译平台，自动生成本地化的`Makefile`和工程文件，最后用户只需要`make`编译即可。其编译流程如下图：![Cmake执行流程图](https://img.hoi3vel.cn/tech/Cmake_01.webp)

- 蓝色虚线表示使用`Makefile`构建项目的过程
- 红色实现表示使用`CMake`构建项目的过程

# 二、CMake的使用
`CMake`支持大写、小写以及混合大小写的命令。如果在编写`CMakeLists.txt`文件时使用的工具有对应的命令提示，那么大小写随缘即可，无需太过在意。

## 2.1 注释
- 注释行：`CMake`中使用`#`实现行注释，可以放在任何位置
- 注释块：`CMake`中使用`#[[]]`实现块注释

```Txt
# 这是一个CMakeLists.txt文件
cmake_minimum_required(VERSION 3.0.0)

#[[这是一个CMakeLists.txt文件
这是一个CMakeLists.txt文件
这是一个CMakeLists.txt文件]]
cmake_minimum_required(VERSION 3.0.0)
```

## 2.2 CMakeLists.txt文件编写
假设源文件夹中文件结构如下：
```Shell
$ tree
.
├── add.c
├── div.c
├── head.h
├── main.c
├── multi.c
└── sub.c
```

### 2.2.1 生成的配置文件不单独放入源文件夹中的子文件中
在上述源文件夹中添加`CMakeLists.txt`。文件内容如下：
```Txt
cmake_minimum_required(VERSION 3.0)
project(CALC)
add_executable(app add.c div.c main.c multi.c sub.c)
```
上述文件中三个命令含义如下：
- `cmake_minimum_required`: 指定使用的`CMake`最低版本。(改命令可选，若不加可能会有警告!)
- `project`: 定义工程的名称并可指定工程的版本、工程描述、web主页地址、支持的语言(默认支持所有的语言)。若不需要则可省略，只需指定出工程名即可。
- `add_executable`: 定义工程生成的可执行程序名字。(这里的可执行程序名字与项目名字无关)

上述命令官方语法如下:
```Txt
# PROJECT 指令的语法是：
project(<PROJECT-NAME> [<language-name>...])
project(<PROJECT-NAME>
       [VERSION <major>[.<minor>[.<patch>[.<tweak>]]]]
       [DESCRIPTION <project-description-string>]
       [HOMEPAGE_URL <url-string>]
       [LANGUAGES <language-name>...])
add_executable(可执行程序名 源文件名称)
# 样式1
add_executable(app add.c div.c main.c multi.c sub.c)
# 样式2
add_executable(app add.c;div.c;main.c;multi.c;sub.c)
```
Ps: 源文件名称可以有多个，若有多个可用`空格`或`;`隔开
在控制台执行`cmake CMakeLists.txt文件所在路径`后，`CMakeLists.txt`中的命令就会被执行。执行之后，源文件夹中的文件结构如下：
```Shell
$ tree -L 1
.
├── add.c
├── CMakeCache.txt         # new add file
├── CMakeFiles             # new add dir
├── cmake_install.cmake    # new add file
├── CMakeLists.txt
├── div.c
├── head.h
├── main.c
├── Makefile               # new add file
├── multi.c
└── sub.c
```

可以看见在对应目录下生成了一个`Makefile`文件，这时再在控制台中执行`make`命令就可以对项目进行构建得到所需要的可执行程序了。结果如下：
```Shell
$ make
Scanning dependencies of target app
[ 16%] Building C object CMakeFiles/app.dir/add.c.o
[ 33%] Building C object CMakeFiles/app.dir/div.c.o
[ 50%] Building C object CMakeFiles/app.dir/main.c.o
[ 66%] Building C object CMakeFiles/app.dir/multi.c.o
[ 83%] Building C object CMakeFiles/app.dir/sub.c.o
[100%] Linking C executable app
[100%] Built target app

# 查看可执行程序是否已经生成
$ tree -L 1
.
├── add.c
├── app					# 生成的可执行程序
├── CMakeCache.txt
├── CMakeFiles
├── cmake_install.cmake
├── CMakeLists.txt
├── div.c
├── head.h
├── main.c
├── Makefile
├── multi.c
└── sub.c
```
最终可执行程序`app`就被编译出来了，其名字由`CMakeLists.txt`中指定。

### 2.2.2 生成的配置文件单独放入源文件夹中的子文件中
在上面的例子中，若`CMakeLists.txt`文件所在目录执行了`cmake`命令之后就会生成一些目录和文件(包括`makefile`)文件。若再基于`makefile`文件执行`make`命令，程序在编译过程中还会产生一些中间文件和可执行文件，这样会导致整个项目目录看起来很混乱，不太容易管理和维护，此时我们就可以把生成的这些与项目源码无关的文件统一放到一个对应的目录里边，通常将整个目录命名为`build`。执行代码以及执行结果为：
```Shell
$ mkdir build
$ cd build
$ cmake ..
-- The C compiler identification is GNU 5.4.0
-- The CXX compiler identification is GNU 5.4.0
-- Check for working C compiler: /usr/bin/cc
-- Check for working C compiler: /usr/bin/cc -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
-- Detecting C compile features - done
-- Check for working CXX compiler: /usr/bin/c++
-- Check for working CXX compiler: /usr/bin/c++ -- works
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /home/robin/Linux/build
```
在上面的代码中，首先创建了一个目录`build`并进入至该目录中，然后再再`build`目录中执行`cmake`命令，由于`CMakeLists.txt`文件中`build`的上级目录中，因此执行`Shell`指令为`cmake ..`。(`..`代表当前目录的上级目录)
当上述命令执行完毕后，在`build`目录中会生成一个`makefile`文件。该目录下的文件结构如下:
```Shell
$ tree build -L 1
build
├── CMakeCache.txt
├── CMakeFiles
├── cmake_install.cmake
└── Makefile

1 directory, 3 files

```
这样就可以在`build`目录中执行`make`命令编译项目，生成的相关文件自然也就被存储到`build`目录中了。

## 2.3 进阶语法
在上面的例子中一共提供了5个源文件，假设这五个源文件需要被反复使用，每次都直接将它们的名字写出来比较麻烦，这时我们需要定义一个变量，该变量可将这些文件名存储起来，在`CMake`中定义变量需要使用关键字`set`。
```Txt
# SET指令语法：
# []中的参数为可选项
SET(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])
```

- VAR: 变量名
- VALUE: 变量值

```Txt
# 方式一: 各个源文件之间使用空格间隔
# set(SRC_LIST add.c div.c main.c multi.c sub.c)

# 方式二: 各个源文件之间使用分号;间隔
set(SRC_LIST add.c;div.c;main.c;multi.c;sub.c)
add_executable(app ${SRC_LIST})
```

### 2.3.1 指定使用C++标准
在编写C++程序时可能会用到C++11、C++14、C++17、C++20等新特性，那么就需要在编译的时候指定出要使用哪个标准：`g++ *.cpp -std=c++11 -o app`。此命令通过`-std=c++11`指定出要使用C++11编译程序，C++标准对应有一宏叫做`DCMAKE_CXX_STANDARD`。在`CMake`中想要指定C++有两种方式：
- 方式一：在CMakeLists.txt中通过set命令指定
```Txt
# 增加-std=c++11
set(CMAKE_CXX_STANDARD 11)
# 增加-std=c++14
set(CMAKE_CXX_STANDARD 14)
# 增加-std=c++17
set(CMAKE_CXX_STANDARD 17)
```
- 方式二：在执行`cmake`命令时指定出这个宏的值
```Shell
#增加-std=c++11
cmake CMakeLists.txt文件路径 -DCMAKE_CXX_STANDARD=11
#增加-std=c++14
cmake CMakeLists.txt文件路径 -DCMAKE_CXX_STANDARD=14
#增加-std=c++17
cmake CMakeLists.txt文件路径 -DCMAKE_CXX_STANDARD=17
```

### 2.3.2 指定输出的路径
在`CMake`中指定可执行程序输出的路径，也对应一个宏叫做`EXECUTABLE_OUTPUT_PATH`，它的值还是通过`set`命令进行设置。
```CMake
set(HOME /home/robin/Linux/Sort)
set(EXECUTABLE_OUTPUT_PATH ${HOME}/bin)
```
- 第一行：定义一个变量用于存储一个绝对路径。
- 第二行：将拼接好的路径值设置给EXECUTABLE_OUTPUT_PATH`宏。（若这个路径的子目录不存在则会自动生成）
由于可执行程序是基于 cmake 命令生成的 makefile 文件然后再执行 make 命令得到的，所以如果此处指定可执行程序生成路径的时候使用的是相对路径 ./xxx/xxx，那么这个路径中的 ./ 对应的就是 makefile 文件所在的那个目录。

### 2.3.3 搜索文件
若一个项目里边的源文件很多，在编写`CMakeLists.txt`文件的时候不可能将项目目录的各个文件一一罗列出来。在`CMake`中提供了文件搜索命令，可以使用`aux_source_directory`命令或者`file`命令。
- 方式一：在`CMake`中使用`aux_source_directory`命令可以查找某个路径下的的所有源文件。
```Txt
aux_source_directory(<dir> <variable>)
```
- dir: 要搜索的目录
- variable: 将从`dir`目录下搜索到的源文件列表存储到该变量中

```CMake
cmake_minimum_required(VERSION 3.0)
project(CALC)
include_directories(${PROJECT_SOURCE_DIR}/include)
# 搜索 src 目录下的源文件
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/src SRC_LIST)
add_executable(app  ${SRC_LIST})

```
- 方式二：采用`file`命令
```Txt
file(GLOB/GLOB_RECURSE 变量名 要搜索的文件路径和文件类型)
```
- `GLOB`: 将指定目录下搜索到满足条件的所有文件名生成一个列表并将其存储到变量中。
- `GLOB_RECURSE`: 递归搜索指定目录，将搜索到的满足条件的文件名生成一个列表并将其存储到变量中。

```Txt
file(GLOB MAIN_SRC ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp)
file(GLOB MAIN_HEAD ${CMAKE_CURRENT_SOURCE_DIR}/include/*.h)
# file(GLOB MAIN_HEAD "${CMAKE_CURRENT_SOURCE_DIR}/src/*.h")
```
搜索当前目录的src目录下所有源文件并存储到变量中。

# 三、最后的话
以上是常用基础的`CMake`命令，还有很多需要完善的地方，后续会慢慢补充...