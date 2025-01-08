/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 16:26:33
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-08 21:18:39
 * @FilePath: /cli/src/utils/publish/getPackageVersion.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from "fs-extra/esm";
import shell from "shelljs";
import { resolveApp } from "../common/removeDir";
import logSymbols from "../common/logSymbols";
import chalk from "chalk";



interface getPackageVersionReturnProps {
    version: string;
    npmExist: boolean;
}

const getPackageVersion = async (): Promise<getPackageVersionReturnProps> => {
    const currentNodeRunDir = resolveApp(`./package.json`);
    const pkg = await fs.readJson(currentNodeRunDir);
    const packageName = pkg['name'];
    const pkgVersion = pkg['version'];
    const execShell = `npm view ${packageName} version`;

    return new Promise((resolve) => {
        shell.exec(execShell, { silent: true }, (code, stdout, stderr) => {
            if (code !== 0) {
                resolve({
                    version: pkgVersion,
                    npmExist: false,
                })
                return;
            }
            resolve({
                version: stdout,
                npmExist: true,
            });
            console.log(logSymbols.success, chalk.green(`获取<${packageName}>版本号成功---> ${stdout}`));
        });
    })
}

export default getPackageVersion;