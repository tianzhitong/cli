/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 23:13:42
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 23:16:37
 * @FilePath: /cli/src/utils/autoOpenViscode.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import shell from 'shelljs';
import ora from 'ora';
import logSymbols from '../common/logSymbols';
import chalk from 'chalk';

const autoOpenViscode = (projectName: string) => {
    const spinner = ora('正在自动打开viscode......').start();
    if (shell.exec(`code ${shell.pwd()}/${projectName}`).code !== 0) {
        console.log(logSymbols.error, chalk.yellow('打开viscode失败，请安装code命令'));
    }

    spinner.succeed(chalk.green('~~~自动打开viscode成功~~~'));
};

export default autoOpenViscode;
