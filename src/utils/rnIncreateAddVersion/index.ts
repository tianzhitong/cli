import fs from 'fs-extra';
import { resolveApp } from '../common/removeDir';
import iosVersionEdit from './iosVersionEdit';
import androidVersionEdit from './androidVersionEdit';
import logSymbols from '../common/logSymbols';
import chalk from 'chalk';

/** rn版本号递增 */
const rnIncreateAddVersion = async () => {
    // 获取项目的package.json
    try {
        const currentNodeRunDir = resolveApp(`./package.json`);
        const pkg = await fs.readJson(currentNodeRunDir);
        const iosLastUseVersionInfo = await iosVersionEdit(pkg);
        const androidLastUseVersionInfo = await androidVersionEdit(pkg);
        console.log(
            `${logSymbols.success}${chalk.green(`ios版本号递增成功：${iosLastUseVersionInfo.MARKETING_VERSION}---->${iosLastUseVersionInfo.CURRENT_PROJECT_VERSION}`)}`,
        );
        console.log(
            `${logSymbols.success}${chalk.green(`android版本号递增成功：${androidLastUseVersionInfo.MARKETING_VERSION}---->${androidLastUseVersionInfo.CURRENT_PROJECT_VERSION}`)}`,
        );
    } catch (error) {
        console.error(error);
    }
};

export default rnIncreateAddVersion;
