---
layout: post
category : 教程
tagline: "android root 原理分析"
tags : [android,驱动]
---

# android 获取权限的原理 #

  在su源代码中，最主要的一句话是
  `execlp("/system/bin/sh" "sh",null)`
  只要执行了这句话就算root了。
  
  其他代码判断参数，判断是否是shell或者root执行的。如下

    if (myuid != AID_ROOT && myuid != AID_SHELL) {
       fprintf(stderr,"su: uid %d not allowed to su\n", myuid);
       return 1;
    }
  普通的root程序是将system中的su程序换成自己的，其在源代码中加入了自己
  的判断，将白名单加入sqlite中，应用层用一个super.apk去管理，当一
  个程序调用su之前，判断其是否在数据库中，如果不在询问是否加入数
  据库。

# java中调用su #
    try {
        Process p = Runtime.getRuntime().exec("su");
        OutputStream out = p.getOutputStream();
        out.write((cmd + "\n").getBytes());
        out.flush();
        out.close();
        if (p.waitFor() == 0) {
            return true;
        }
        return false;
    } catch (Exception e) {
        return false;
    }
