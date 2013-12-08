---
layout: post
category : 教程 
tagline: "__一"
tags : [web]
---
## 简介 

### 什么是mongoDb
mongoDB[1]是一个基于分布式文件存储的数据库。由C++语言编写。旨在为WEB应用提供可扩展的高性能数据存储解决方案。
MongoDB是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。他支持的数据结构非常松散，是类似json的bson格式，因此可以存储比较复杂的数据类型。Mongo最大的特点是他支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。
### mongoDB特点
它的特点是高性能、易部署、易使用，存储数据非常方便。主要功能特性有：
*面向集合存储，易存储对象类型的数据。
  *模式自由。
  *支持动态查询。
  *支持完全索引，包含内部对象。
  *支持查询。
  *支持复制和故障恢复。
  *使用高效的二进制数据存储，包括大型对象（如视频等）。
  *自动处理碎片，以支持云计算层次的扩展性。
  *支持RUBY，PYTHON，JAVA，C++，PHP,C#等多种语言。
  *文件存储格式为BSON（一种JSON的扩展）。
  *可通过网络访问。
  
### mongoDB 和关系型数据库的区别




### mongoDB的适用范围 


# mongoDB的安装 
 我这里只讲我手里的设备是怎样安装的，在mac上利用brewhome 安装，brewhome类似于unbuntu的apt－get,非常方便；

##mac

    brew install mongodb
 
##linux
   [下载](http://fastdl.mongodb.org/linux/mongodb-linux-i686-2.0.4.tgz)
mongoDB到你喜欢的路径;将其解压即可，如果其路径不在系统路径内，在/etc/profile里加入路径即可，或者在/home/.bash_profile； 一个是系统的终端设置，一个是当前用户的；

    export PATH=$PATH:YOUR PATH

# mongoDB 用法
##启动
    
    #默认端口:27017
    Talent_xia@localhost:~/develope/mongoDB/data $mongod --dbpath=./db
    all output going to: /usr/local/var/log/mongodb/mongo.log

##测试

    MongoDB shell version: 2.4.1
    connecting to: test
    Welcome to the MongoDB shell.
    For interactive help, type "help".
    For more comprehensive documentation, see
        http://docs.mongodb.org/
        Questions? Try the support group
         http://groups.google.com/group/mongodb-user
         >

## 设置为开机启动
     在/etc/rc.local 中加入mongod --dbpath=/data/db --logpath=/usr/local/mongodb/logs/mongodb.log
     
