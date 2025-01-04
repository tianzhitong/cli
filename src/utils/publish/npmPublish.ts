/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 00:50:40
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-05 00:57:15
 * @FilePath: /cli/src/utils/publish/npmPublish.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import shell from "shelljs";
import ora from "ora";
import chalk from "chalk";
import logSymbols from "../common/logSymbols";


const npmPublish = () => {
    const spinner = ora('正在发布npm......').start();
    if (shell.exec(`npm publish`).code !== 0) {
        console.log(logSymbols.error, chalk.yellow('发布失败。请查看原因！'));
    }

    spinner.succeed(chalk.green('~~~发布npm成功~~~'))
}

export default npmPublish;