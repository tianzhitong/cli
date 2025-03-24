/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 00:20:13
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-05 17:56:46
 * @FilePath: /cli/src/utils/publish/editPwdVersion.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from 'fs-extra';
import chalk from 'chalk';
import logSymbols from '../common/logSymbols';
import { resolveApp } from '../common/removeDir';
import { initPublishProps } from './initPublish';

export const increateVersion = (props: initPublishProps, version: string) => {
    const { left, middle, right } = props;
    const editVersion = version.trim();
    const editVersionList = editVersion.split('.');
    let resultVersion = '';

    if (editVersion.length === 0) {
        console.log(logSymbols.error, chalk.redBright('暂未获取到version。请查看！'));
        return;
    }

    if (left) {
        resultVersion = [String(Number(editVersionList[0]) + 1), '0', '0'].join('.');
    }

    if (middle) {
        resultVersion = [editVersionList[0], String(Number(editVersionList[1]) + 1), '0'].join('.');
    }

    if ((!left && !middle) || right) {
        resultVersion = [editVersionList[0], editVersionList[1], String(Number(editVersionList[2]) + 1)].join('.');
    }

    return resultVersion;
};

const editPwdVersion = async (props: initPublishProps, version: string) => {
    const currentNodeRunDir = resolveApp(`./package.json`);
    const pkg = await fs.readJson(currentNodeRunDir);
    const resultVersion = increateVersion(props, version);
    pkg['version'] = resultVersion;
    await fs.writeJson(currentNodeRunDir, pkg, { spaces: 2 });

    return pkg['version'];
};

export default editPwdVersion;
