/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 23:59:19
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-05 01:43:28
 * @FilePath: /cli/src/utils/initPublish.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import editPwdVersion from "./editPwdVersion";
import npmPublish from "./npmPublish";
import shelljs from "shelljs";

export interface initPublishProps {
    left: boolean
    middle: boolean;
    right: boolean;
}

const initPublish = async (props: initPublishProps) => {
    // 【1】修改版本号
    await editPwdVersion(props);
    // 【2】发布npm
    await npmPublish();
    // 退出程序
    shelljs.exit(1);
}


export default initPublish;