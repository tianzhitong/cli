import fs from 'fs-extra';
import { resolveApp } from '../common/removeDir';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { increateVersion } from '../publish/editPwdVersion';

// 提取当前的版本信息
const marketingVersionRegex = /MARKETING_VERSION = ([^;]+);/g;
const currentProjectVersionRegex = /CURRENT_PROJECT_VERSION = ([^;]+);/g;

const iosVersionEdit = async (pkg: any) => {
    // 获取项目的package.json
    const editIosVersionPath = pkg.iosFilePath;
    // 获取ios的appId
    const appleId = pkg.appleId;
    const lastUseVersionInfo = {
        MARKETING_VERSION: '',
        CURRENT_PROJECT_VERSION: 0,
    };
    // 获取ios的版本号
    const curl = `https://apps.apple.com/us/app/flare-short/id${appleId}`;
    const { data } = await axios.get(curl);
    const $ = cheerio.load(data);
    const versionText = $('p[class="l-column small-6 medium-12 whats-new__latest__version"]').text();
    // ios应用市场的版本号
    const iosVersion = versionText.split('Version')[1].trim();
    if ((iosVersion ?? '').length === 0) {
        throw new Error(`获取ios版本号失败！`);
    }

    let iosVersionContent = fs.readFileSync(resolveApp(editIosVersionPath), 'utf-8');
    const marketingVersionMatches = [...iosVersionContent.matchAll(marketingVersionRegex)];
    const currentProjectVersionMatches = [...iosVersionContent.matchAll(currentProjectVersionRegex)];
    if (!marketingVersionMatches.length || !currentProjectVersionMatches.length) {
        throw new Error('无法在项目文件中找到版本信息');
    }

    const currentProjectVersion = Number(currentProjectVersionMatches[0][1]);

    lastUseVersionInfo.MARKETING_VERSION = increateVersion({ right: true, left: false, middle: false }, iosVersion);
    lastUseVersionInfo.CURRENT_PROJECT_VERSION = currentProjectVersion + 1;
    // 更新所有匹配项（通常Debug和Release配置都需要更新）
    iosVersionContent = iosVersionContent.replace(
        marketingVersionRegex,
        `MARKETING_VERSION = ${lastUseVersionInfo.MARKETING_VERSION};`,
    );

    iosVersionContent = iosVersionContent.replace(
        currentProjectVersionRegex,
        `CURRENT_PROJECT_VERSION = ${lastUseVersionInfo.CURRENT_PROJECT_VERSION};`,
    );

    // 写入文件
    fs.writeFileSync(resolveApp(editIosVersionPath), iosVersionContent, 'utf-8');

    return lastUseVersionInfo;
};

export default iosVersionEdit;
