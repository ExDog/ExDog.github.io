---
layout: post
category : 教程 
tagline: "android底层关于刷机"
tags : [android]
---

  最近公司需要在一个android的盒子上加一个原野的触屏驱动，于是呼就折腾android系统折腾了将尽一个月，一点进展都木有；倒是开了不少资料，刷机刷的很溜。

## 基础

### 什么是刷机 
刷机就类似与重装系统，android 有不同的系统结构，你可以选择部分替换，或者全部替换原有的系统。或者可以刷成具有root权限的用户；
### 刷机的好处
由于买的手机大部分都被厂家安装了默认程序，或者是在开机的时候，回出现厂家的logo之类的，或者就是你需要将你所开发的系统 开机启动，再或者原有的手机没有某些硬件的驱动，这时候你想要定制一个按自己意愿做事的手机，这些刷机都能办的到；
##  刷机包update.zip内容
    .
    |-- boot.img
    |   |-- radisk.img
    |   |-- kernel(zImage)
    |-- META-INF
    |-- system.img

- **\boot.img**     
    文件，这是编译内核源代码生成的内核映像,图省事的朋友也可以从网上其他的刷机包里面拷贝一个能用的出来即可，基本上都差不多。
- **\ramdisk.img**  
    编译android源码的时候生成的  在$ANDROID/out/target/product/generic里面

- **\zImage**   
    编译linux内核时候产生的一个内核镜像,和上面的ramdisk可以通过mkbootimg打包成boot.img
  
- **\META-INF** 
    这个目录是手工创建的，主要用来存放一个升级脚本update-script（这个脚本的内容与system目录中包含的文件有很大关联）以及保存若干刷机包内的apk文件的签名。

- **\system**   
    这个目录就是编译android的平台源代码生成的
    
## 解包
 一般新手都是从改包开始，然后定制一部分自己的手机，然后有了兴趣，才能继续前行；如果在公司那就没有办法了；
- 解zip包，直接解压缩，或者下面命令，得到**boot.img** **META-INF** **system** 

    unzip update.zip    


- 定制自己的system  
  system对应的就是android system目录，里面有系统预装的应用程序，你可以把自己的程序放到里面，也可以删除系统的程序；

- 修改刷机脚本  
    如果自己写这个脚本，我觉得不太现实，我是菜鸟，只能修改东西;  
- 利用解包脚本解boot.img  

    unpackbootimg -i .\tmp\boot.img -o .\out
    它会解压出如下文件：
    boot.img-zImage (内核文件）
    boot.img-ramdisk.gz (根文件系统打包文件）
    boot.img-cmdline (mkbootimg cmdline参数)
    boot.img-pagesize (mkbootimg pagesize参数)
    boot.img-base (mkbootimg base参数)
    

- 替换内核文件  

   编译好的zImage 最好与硬件相符合，最好是官方提供的吧，这个我真的不是很清楚，也像尽力弄明白；
   ramdisk 如果用自己编译后的ramdisk 其中有很多东西都是带着软链接的指向busybox，在执行刷机脚本的时候又会链接一次，会出错，所以要删除这些软链接；
   这里有个很大的{问题}(http://aaa)

## 组包
 做完了解包，你现在就有组装android的所有零件了，下面就是拼凑。
- 打包zImage ramdisk 成boot.img    
mkbootimg --cmdline 'no_console_suspend=1 console=null' --kernel zImage --ramdisk boot/boot.img-ramdisk.gz -o boot.img --base 02e00000

这句含义是把内核文件zImage和boot目录下的根文件压缩包 boot.img-ramdisk.gz打包成boot.img.
其中cmdline和base的值均来源于unpackbootimg的结果

- 重新打包成update.zip
    zip -r update.zip .   <---注意这最后的“.”是必不可少的，代表是当前路径下的意思.   

- 签名 
    利用签名工具签名
    $ java -jar autosign.jar update.zip update_signed.zip


## 刷机
一般来说机器变砖的概率不大，一般fastboot 和recovery 一个能用就能救砖；那就意味这刷机有两种方式,即一种fastboot，recovery
### fastboot 刷机
 - 进入fastboot模式，开机的时候 按电源键＋声音上
    fastboot devices 
    fastboot erase boot/system/userdata/recovery
    fastboot flash boot boot.img/....
    fastboot update update.zip

    
   
### recovery 刷机
- 将以上组好的刷机包，放入sdcard中，然后开机的时候电源按键+声音下 进入recovery模式，选择update然后选择你的包；

## 总结
一般来说，内核部分，你要修改都不是那么容易的，修改完后大部分都是起不来机子的。上层的删删应用程序还好，或者自己买一个开发板，有源代码学起来会容易很多，开发板600左右足够用了。我也是菜鸟，快要有个开发板入手了！ 有点激动....

## 参考 
http://bbs.gfan.com/android-1910598-1-1.html
https://code.google.com/p/volatility/wiki/AndroidMemoryForensics
