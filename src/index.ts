#!/usr/bin/env node
/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 01:58:37
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-22 22:07:08
 * @FilePath: /cli/src/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import figlet from 'figlet';
import chalk from 'chalk';
import { table } from 'table';
import { program } from 'commander';
import { CLI_NAME, CLI_VERSION, GIT_TEMPLATE_LIST } from './config/const';
import logSymbols from './utils/common/logSymbols';
import initPublish from './utils/publish/initPublish';
import initAction from './utils/create/initAction';
import apiGenTs from './utils/apiGenTs';
import nrmCommand from './utils/nrm';
import { configProps } from '../apiGenTs';
import rnPushGitVersionTag from './utils/rnPushGitVersionTag';
import rnIncreateAddVersion from './utils/rnIncreateAddVersion';
export type GlobalConfigProps = configProps;

program.version(CLI_VERSION, '-v --version');

console.log(
    '\r\n' +
        chalk.greenBright.bold(
            figlet.textSync(CLI_NAME, {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 80,
                whitespaceBreak: true,
            }),
        ),
);

console.log(`\r\nRun ${chalk.cyan(`${CLI_NAME} <command> --help`)} for detailed usage of given command\r\n`);

program
    .name(CLI_NAME)
    .description('自定义脚手架')
    .usage('<command> [options]')
    .on('--help', () => {
        console.log(
            '\r\n' +
                chalk.greenBright.bold(
                    figlet.textSync(CLI_NAME, {
                        font: 'Standard',
                        horizontalLayout: 'default',
                        verticalLayout: 'default',
                        width: 80,
                        whitespaceBreak: true,
                    }),
                ),
        );
        console.log(`\r\nRun ${chalk.cyan(`${CLI_NAME} <command> --help`)} for detailed usage of given command\r\n`);
    });

program
    .command('create <app-name>')
    .description('创建新项目')
    .option('-t, --template [template]', '输入模板名称创建项目')
    .option('-f, --force', '强制覆盖本地同名项目')
    .action(initAction);

program
    .command('publish')
    .description('npm私服包发布')
    .option('-l, --left', '修改最左边版本')
    .option('-m, --middle', '修改中间版本')
    .option('-r, --right', '修改最右边版本')
    .action(initPublish);

program.command('rnPushGitVersionTag').description('查看android版本并git tag提交').action(rnPushGitVersionTag);
program.command('rnIncreateAddVersion').description('递增rn版本号').action(rnIncreateAddVersion);

program.command('apiGenTs').description('根据接口配置文件动态生成ts').option('-m, --useMethodByPath', '使用方法作为路径参数').action(apiGenTs);

program.command('nrm <command>').description('切换npm源').action(nrmCommand);

program
    .command('list')
    .description('查看所有可用模板')
    .action(() => {
        const data = GIT_TEMPLATE_LIST.map((item) => [chalk.bold.yellowBright(item.name), item.value, item.desc]);

        data.unshift([chalk.yellowBright('模板名称'), chalk.yellowBright('模板地址'), chalk.yellowBright('模板描述')]);
        const config = {
            header: {
                alignment: 'center',
                content: chalk.yellowBright(logSymbols.star + ' 模板列表'),
            },
        };
        console.log(table(data, config as any));
        console.log(chalk.yellowBright(logSymbols.star, '模板列表'));
    });

// 利用commander解析命令行输入，必须写在所有内容最后面
program.parse(process.argv);
