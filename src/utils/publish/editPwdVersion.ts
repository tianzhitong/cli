/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 00:20:13
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-05 00:49:46
 * @FilePath: /cli/src/utils/publish/editPwdVersion.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from "fs-extra"
import chalk from "chalk";
import logSymbols from "../logSymbols";
import { resolveApp } from "../removeDir";
import { initPublishProps } from "../initPublish";


const editPwdVersion = async (props: initPublishProps) => {
    const { left, middle, right } = props;
    const currentNodeRunDir = resolveApp(`./package.json`);
    const pkg = await fs.readJson(currentNodeRunDir);
    const editVersion = ((pkg?.version ?? '') as string).trim();
    const editVersionList = editVersion.split('.')

    if (editVersion.length === 0) {
        console.log(logSymbols.error, chalk.redBright("暂未获取到version。请修改！"));
        return;
    }

    if (left) {
        pkg['version'] = [String(Number(editVersionList[0]) + 1),'0','0'].join('.');
    }

    if (middle) {
        pkg['version'] = [editVersionList[0],String(Number(editVersionList[1]) + 1),'0'].join('.');
    }

    if((!left && !middle) || right) {
        pkg['version'] = [editVersionList[0],editVersionList[1],String(Number(editVersionList[2]) + 1)].join('.');
    }
    await fs.writeJson(currentNodeRunDir, pkg, { spaces: 2 })
}

export default editPwdVersion;