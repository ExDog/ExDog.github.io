---
layout: post
category : 教程 
tagline: "使用emacs－markdown快速写博客"
tags : [linux]
---

### 最近想好好总结每天所接触到的技术，所以想养成写博客的习惯，搭建了一个博客平台，可以使用markdown写日志. ###



### 1.安装配置 ###
 我所使用的是别人配置好的emacs，但是我还是把关于这部分的配置找了出来，
 
  当启动emacs时，会读取.emacs.d/init.el配置文件,其中
  
  `(require 'init-markdown)`
  
  这句话加载markdownmode
  
  init-markdwon中
  
  `(autoload 'markdown-mode "markdown-mode" "Mode for editing Markdown documents" t)
(setq auto-mode-alist
      (cons '("\\.\\(md\\|markdown\\)\\'" . markdown-mode)
 auto-mode-alist))`


这样，当emacs读取.md文件时，就会自动转化为markdown模式


### 2.常用快捷编辑命令 ###

* C-c C-t t first level settext
* C-c C-t s second level settext
* C-c C-t number 标题样式等级

* C-c C-s s   **粗体**
* C-c C-s e   *粗体2*
* C-c C-s b 

    > 块
    
    > 块


* C-c C-s p

        预先格式化

* C-c C-s c  `代码`

* C-c C-a l  [百度](www.baidu.com)


* C-c C-a r  [linktext][1]

* C-c C-a f [^1]

* C-c C-a u <www.baidu.com>

[1]: index "link title"











[^1]: index/index.html
