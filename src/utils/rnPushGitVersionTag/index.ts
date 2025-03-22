import chalk from 'chalk';
import logSymbols from '../common/logSymbols';
import { resolveApp } from '../common/removeDir';
import fs from 'fs-extra';
import gitAddVersionTag from '../publish/gitAddVersionTag';

const rnPushGitVersionTag = async () => {
    try {
        // 查询app项目的版本号
        const getGradleFilePath = resolveApp('./android/app/build.gradle');
        const getGradleFileContent = fs.readFileSync(getGradleFilePath, 'utf-8');
        // 使用正则表达式获取versionName
        const versionNameRegex = /versionName\s+"([^"]+)"/;
        const match = getGradleFileContent.match(versionNameRegex);
        if (!match) {
            throw new Error(`获取android版本号失败！`);
        }
        const versionName = match[1];
        await gitAddVersionTag(versionName);
        console.log(`${logSymbols.success}${chalk.green('执行成功 -> 查看android版本号并git tag提交成功！')}`);
    } catch (ex) {
        console.log(`${logSymbols.error}${chalk.yellow('执行失败 -> ' + String(ex))}`);
    }
};

export default rnPushGitVersionTag;
