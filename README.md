<!--
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 18:09:58
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-09 20:03:51
 * @FilePath: /cli/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
### 使用命令创建项目模板
npx tianzhitong-cli create 【project-name】

### 使用命令动态创建ts接口文件
npx tianzhitong-cli apiGenTs
重点：需要在项目下放置apiGenTs.config.js文件。
具体具体内容参考当前源码下的apiGenTs.config.js文件

### 使用命令改变npm的源
查看所有的源
npx tianzhitong-cli nrm ls

改变源命令
originName：npm、yarn、tencent、cnpm、taobao、npmMirror、huawei、private
npx tianzhitong-cli nrm 【originName】
比如：npx tianzhitong-cli nrm taobao
### 使用本包发布到npm。默认修改最右侧版本
npx tianzhitong-cli publish

### 修改最左侧大版本
npx tianzhitong-cli publish -l

### 修改中间版本
npx tianzhitong-cli publish -m

### 修改右侧版本
npx tianzhitong-cli publish -m