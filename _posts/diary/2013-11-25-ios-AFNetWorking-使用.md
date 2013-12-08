---
layout: post
category : 教程 
tagline: "ios关于网络连接"
tags : [ios]
---
**有用网址**

* [git官方网址](https://github.com/AFNetworking/AFNetworking/)

* [封装成单例使用](http://itjoy.org/?p=641)

* [AFNetWorking官方样本](https://github.com/AFNetworking/Xcode-Project-Templates)

* [AFSessionManager文档](http://cocoadocs.org/docsets/AFNetworking/2.0.0/Classes/AFHTTPSessionManager.html)

# 我的实现 #

  是参考weather的，封装出一个单例，然后注册一个代理，当调用getdate的时
 候，得到返回值result，然后在代理中调用返回方法。


### 单例头文件 ###

*.h
 
    #import "AFNetworking.h"
    #import "EXConstants.h"
    @protocol HttpClientDelegate;
    @interface GamePlayerAPIClient :  AFHTTPRequestOperationManager
    + (instancetype)sharedClient;
    @property(weak) id<HttpClientDelegate> delegate;
    -(void)getData:(NSString*)url withParameter:(NSDictionary*)parameters;
    @end
    
    @protocol HttpClientDelegate <NSObject>
    -(void)GamePlayerAPIClient:(GamePlayerAPIClient *)client didUpdateWithData:(id)result;
    -(void)GamePlayerAPIClient:(GamePlayerAPIClient *)client didFailWithError:(NSError *)error;
    @end

*.m


    #import "GamePlayerAPIClient.h"
    
    
    @implementation GamePlayerAPIClient
    
    + (instancetype)sharedClient {
    static GamePlayerAPIClient *_sharedClient = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
    _sharedClient = [[self alloc] initWithBaseURL:[NSURL URLWithString:SERVER]];
    });
    
    return _sharedClient;
    }
    
    /**
    * 一个最基础的url
    */
    - (id)initWithBaseURL:(NSURL *)url {
    self = [super initWithBaseURL:url];
    if (!self) {
    return nil;
    }
    self.responseSerializer.acceptableContentTypes =[NSSet setWithObject:@"text/html"];
    return self;
    }
    
    -(void)getData:(NSString*)url withParameter:(NSDictionary*)parameters{
    NSLog(@"Url%@====",url);
    [self POST:url parameters: parameters success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSLog(@"%@=====",responseObject);
    id result=[self dealJsonDataWithUrlString:url withJson:responseObject];
    if([self.delegate respondsToSelector:@selector(GamePlayerAPIClient:didUpdateWithData:)])
    [self.delegate GamePlayerAPIClient:self didUpdateWithData:result];
    
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    NSLog(@"%@===",error);
    if ([self.delegate respondsToSelector:@selector(GamePlayerAPIClient:didFailWithError:)]) {
    [self.delegate GamePlayerAPIClient:self didFailWithError:error];
    }
    }];
    
    /**
    *  返回当前的网络状态
     */
     NSLog(@"net type=%d",[[self reachabilityManager] networkReachabilityStatus]);
     }
     
     /**
     * 处理数据
     */
     -(id)dealJsonDataWithUrlString:(NSString*) url withJson:(NSDictionary*)json
     {
     if ([json objectForKey:@"success"])
     return [json objectForKey:@"result"];
     else
     return nil;
     }

### 调用部份 ###
 在掉用类中,继承HttpClientDelegate 接口然后实现getdate方法.

     #pragma httpclient
     /**getdate后的回掉方法.当请求错误时候,回调
     */
     -(void)GamePlayerAPIClient:(GamePlayerAPIClient *)client didFailWithError:(NSError *)error
     {
     
     }


     /**
     *  httpclientdelegate中的回调方法,当请求网络数据成功时回调该方法
     */
     -(void)GamePlayerAPIClient:(GamePlayerAPIClient *)client didUpdateWithData:(id)result
     {
     NSLog(@"result:::::::::%@::::::::::::::",result);
     NSArray *results=result;
     NSLog(@"aa%@",[[results objectAtIndex:0] objectForKey:@"pageName"]);
     }

     /**
     *  掉用httpclient的方法,然后将代理指向自己,到时候就回回调,该类中
     * 的以上两种方法.
     */
     -(void)getData
     {
     [GamePlayerAPIClient sharedClient].delegate=self;
     [[GamePlayerAPIClient sharedClient] getData:@"/home" withParameter:nil];
     }

  当显示图片的时候:直接掉用
