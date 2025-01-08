/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 23:59:19
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-08 21:18:13
 * @FilePath: /cli/src/utils/initPublish.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import editPwdVersion from "./editPwdVersion";
import getPackageVersion from "./getPackageVersion";
import gitAddVersionTag from "./gitAddVersionTag";
import npmPublish from "./npmPublish";
import shelljs from "shelljs";

export interface initPublishProps {
    left: boolean
    middle: boolean;
    right: boolean;
}

const initPublish = async (props: initPublishProps) => {
    try {
        // 【1】获取当前要发布包的版本
        const { version, npmExist } = await getPackageVersion();

        // 【2】修改之后的版本号
        const editAfterVersion = npmExist ? await editPwdVersion(props, version) : version;

        // 【3】发布npm
        await npmPublish();
        // 【4】git添加tag信息
        await gitAddVersionTag(editAfterVersion);
        // 退出程序
        shelljs.exit(1);
    } catch (ex) {
        console.log('错误信息 ---->', ex)
        shelljs.exit(1);
    }
}


export default initPublish;