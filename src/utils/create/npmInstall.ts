/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 22:28:30
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 23:24:02
 * @FilePath: /cli/src/utils/npmInstall.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import shell from "shelljs";
import ora from "ora";
import logSymbols from "../common/logSymbols";
import chalk from "chalk";


const npmInstall = (projectDir: string) => {
    const spinner = ora('正在安装依赖......').start();
    if (shell.exec(`cd ${shell.pwd()}/${projectDir} && npm install --force -d`).code !== 0) {
        console.log(logSymbols.error, chalk.yellow('自动安装依赖失败，请手动安装'));
    }

    spinner.succeed(chalk.green('~~~依赖安装成功~~~'))
    spinner.succeed(chalk.green('~~~项目创建完成~~~'))
}

export default npmInstall;