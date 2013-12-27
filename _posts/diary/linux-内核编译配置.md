---
layout: post
tagline: "android内核配置"
tags : [硬件]
---

* 内核配置

   make menuconfig 或者make ARCH=arm menuconfig

* 编译

   make kernel.img

* 清除编译的东西

   make clean

# linux 内核支持adk #

* 有人在要配置adk时，发现在android 设备中的/proc/找不到config.gz,那是在编译内核的时候，没有勾选Enable access to .config through /proc/config.gz

   进入android kernel目录，make menuconfig 或者make ARCH=arm menuconfig

             General setup  --->
                   Kernel .config support
                        [*] Enable access to .config through /proc/config.gz
   在该栏目中按y 即可。

*  adk支持（暂时没找到记录一下）

        add: ADB Garget /drives/usb/gadget/
        CONFIG_USB_ANDROID    (android.c)
        CONFIG_USB_ANDROID_ACM   (f_acm.c u_serial.c)
        CONFIG_USB_ANDROID_ADB   (f_adb.c)
        CONFIG_USB_ANDROID_MASS_STORAGE (f_mass_storage.c)
        CONFIG_USB_ANDROID_MTP   (f_mtp.c)
        CONFIG_USB_ANDROID_RNDIS     (f_rndis.c u_ether.c)
        CONFIG_USB_ANDROID_ACCESSORY (f_accessory.c)

        Device Drivers  --->
            <*> Switch class support
                [*] USB support  --->
                    <*> USB Gadget Support  --->
                        <*> USB Gadget Drivers (Android Gadget)  --->
                            [*]       Android gadget adb function
                            [*]       Android gadget mass storage function

## 判断设备是否支持adk ##

*

    adb pull /proc/config.gz
  然后打开，应该会有以下字段

    ezgb_ebi0_defconfig:CONFIG_USB_ANDROID_ACCESSORY=y
    ezgb_2708_defconfig:CONFIG_USB_ANDROID_ACCESSORY=y
    ezgb_ebi1_defconfig:CONFIG_USB_ANDROID_ACCESSORY=y

* 另外需要在system/framework/下 com.android.future.usb.accessory.jar，

* /etc/permissions/下 android.hardware.usb.accessory.xml

# 内核usbtouchscreen 位置 #

    Device Drivers->
        Input Device support ->
            Touchscreens ->
                  USB Touchscreen Driver

# 内核支持动态加载模块 #


# 参考网页 #
[demokit原理](http://jeffreysambells.com/2011/05/17/understanding-the-demokit-pde-arduino-sketch)
[环境搭建][http://blog.csdn.net/slugzoe/article/details/6897534]
