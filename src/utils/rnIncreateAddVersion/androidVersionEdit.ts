/*
 * @Author: tianzhitong rabiakilic833827@gmail.com
 * @Date: 2025-04-18 14:43:12
 * @LastEditors: tianzhitong rabiakilic833827@gmail.com
 * @LastEditTime: 2025-04-18 15:01:40
 * @FilePath: /cli/src/utils/rnIncreateAddVersion/androidVersionEdit.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from 'fs-extra';
import axios from 'axios';
import { resolveApp } from '../common/removeDir';
import { increateVersion } from '../publish/editPwdVersion';

const androidVersionEdit = async (pkg: any) => {
    const lastUseVersionInfo = {
        MARKETING_VERSION: '',
        CURRENT_PROJECT_VERSION: 0,
    };
    // android逻辑添加
    const originGoogleVersion = await (async () => {
        if (!pkg.googlePlayId) {
            return '1.0.0';
        }
        const storeUrl = `https://play.google.com/store/apps/details?id=${pkg.googlePlayId}&hl=en&gl=US`;
        const androidInfoRes = await axios.get(storeUrl);
        const matchNewLayout = androidInfoRes.data.match(/\[\[\["([\d.]+?)"\]\]/);
        if (matchNewLayout.length === 0) throw new Error('获取android版本号失败1');
        // 获取远程google 版本号
        const originGoogleVersion = matchNewLayout[1].trim();
        return originGoogleVersion;
    })();
    const androidFilePath = pkg.androidFilePath;
    let androidVersionContent = fs.readFileSync(resolveApp(androidFilePath), 'utf-8');
    // 使用正则表达式匹配和替换 versionCode
    const versionCodeRegex = /(versionCode\s+)(\d+)/;
    const versionNameRegex = /(versionName\s+")([^"]+)(")/;

    const currentVersionCodeMatch = androidVersionContent.match(versionCodeRegex);
    if (!currentVersionCodeMatch) {
        throw new Error('未找到 versionCode');
    }
    const currentVersionCode = parseInt(currentVersionCodeMatch[2], 10);

    lastUseVersionInfo.CURRENT_PROJECT_VERSION = currentVersionCode + 1;
    // 替换 versionCode
    androidVersionContent = androidVersionContent.replace(
        versionCodeRegex,
        `$1${lastUseVersionInfo.CURRENT_PROJECT_VERSION}`,
    );

    const resultVersionName = pkg.googlePlayId
        ? increateVersion({ right: true, left: false, middle: false }, originGoogleVersion)
        : '1.0.0';
    lastUseVersionInfo.MARKETING_VERSION = resultVersionName;
    androidVersionContent = androidVersionContent.replace(versionNameRegex, `$1${resultVersionName}$3`);

    // 写入更新后的内容
    fs.writeFileSync(resolveApp(androidFilePath), androidVersionContent, 'utf8');

    return lastUseVersionInfo;
};

export default androidVersionEdit;
