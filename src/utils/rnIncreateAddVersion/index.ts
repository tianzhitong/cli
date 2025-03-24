import fs from 'fs-extra';
import { resolveApp } from '../common/removeDir';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'node:path';
import { increateVersion } from '../publish/editPwdVersion';

// 提取当前的版本信息
const marketingVersionRegex = /MARKETING_VERSION = ([^;]+);/g;
const currentProjectVersionRegex = /CURRENT_PROJECT_VERSION = ([^;]+);/g;

/** rn版本号递增 */
const rnIncreateAddVersion = async () => {
    // 获取项目的package.json
    const currentNodeRunDir = resolveApp(`./package.json`);
    const pkg = await fs.readJson(currentNodeRunDir);
    const editIosVersionPath = pkg.iosFilePath;
    // 获取ios的appId
    const appleId = pkg.appleId;
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

    const iosVersionContent = fs.readFileSync(path.join(resolveApp(editIosVersionPath)), 'utf-8');
    const marketingVersionMatches = [...iosVersionContent.matchAll(marketingVersionRegex)];
    const currentProjectVersionMatches = [...iosVersionContent.matchAll(currentProjectVersionRegex)];
    if (!marketingVersionMatches.length || !currentProjectVersionMatches.length) {
        throw new Error('无法在项目文件中找到版本信息');
    }

    const currentProjectVersion = Number(currentProjectVersionMatches[0][1]);

    let pbxprojContent = '';
    // 更新所有匹配项（通常Debug和Release配置都需要更新）
    pbxprojContent = iosVersionContent.replace(
        marketingVersionRegex,
        `MARKETING_VERSION = ${increateVersion({ right: true, left: false, middle: false }, iosVersion)};`,
    );

    pbxprojContent = pbxprojContent.replace(
        currentProjectVersionRegex,
        `CURRENT_PROJECT_VERSION = ${currentProjectVersion + 1};`,
    );

    // 写入文件
    fs.writeFileSync(resolveApp(editIosVersionPath), pbxprojContent, 'utf-8');

    // 递增项目中ios打包的版本
    // 查看android远程版本号
    // const getGradleFileContent = fs.readFileSync(resolveApp('./package.json'), 'utf-8');
    // const androidApplicationIdRegex = /applicationId\s+"([^"]+)"/;
    // const match = getGradleFileContent.match(androidApplicationIdRegex);
    // if (!match) {
    //     throw new Error(`获取android包名失败！`);
    // }
    // const androidApplicationId = match[1];
    // const curl = `https://play.google.com/store/apps/details?id=${androidApplicationId}`;
    // console.log('curl', curl);
    // const { data } = await axios.get(curl);
    // const $ = cheerio.load(data);
    // console.log('$', $);
    // const version = $('div[itemprop="softwareVersion"]').text().trim();
    // console.log('version', version);
};

export default rnIncreateAddVersion;
