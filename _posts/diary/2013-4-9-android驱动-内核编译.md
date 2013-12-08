---
layout: post
category : 教程 
tagline: "android内核编译"
tags : [android]
---

## android内核编译时配置问题
- 问题一： 

    drivers/video/console/vgacon.c:494: error: `PCIMEM_BASE' undeclared (first use in this function)
    drivers/video/console/vgacon.c:494: error: (Each undeclared identifier is reported only once 

    解决方法：

    device drivers-> 
    Graphics support-> 
    Console display driver support-> 
    [ ]VGA text console（取消）
- 问题二

    net/netfilter/xt_CONNMARK.o', needed by `net/netfilter/built-in.o'
 
    解决方法：
    我直接禁掉了netfilter
    
- 问题三

    this is text