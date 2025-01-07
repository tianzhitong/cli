/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 21:15:47
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-07 20:43:42
 * @FilePath: /cli/src/utils/removeDir.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "node:path";

/** 当前脚本运行的地址 */
const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

const removeDir = async (dirName: string) => {
    const spinner = ora({
        text: `正在删除文件夹${chalk.cyan(dirName)}`,
        color: "yellow",
    }).start();

    try {
        await fs.remove(resolveApp(dirName));
        spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dirName)}成功`));
    } catch (err) {
        spinner.fail(chalk.redBright(`删除文件夹${chalk.cyan(dirName)}失败`));
        return;
    }
}

export default removeDir;