/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 20:42:31
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-10 06:03:42
 * @FilePath: /cli/src/utils/initAction.ts
 * @Description: 检测git并且克隆项目
 */
import shell from 'shelljs';
import chalk from 'chalk';
import fs from 'fs-extra';
import { inquirerConfirm } from '../common/interactive';
import npmInstall from './npmInstall';
import autoOpenViscode from './autoOpenViscode';
import logSymbols from '../common/logSymbols';
import cloneRepo from './cloneRepo';
import removeDir from '../common/removeDir';
import getParamsRepo from './getParamsRepo';
import changePackageJson from './changePackageJson';
// 当前脚本运行时的路径 + 路径分隔符 + 要创建的目录的名字
// const currentPwdprojectNameDir = join(process.cwd() + sep + projectName);

interface initActionOptionProps {
    /** 输入的模板 */
    template?: string;
    /** 项目存在是否删除 */
    force?: boolean;
}

const initAction = async (projectName: string, option: initActionOptionProps) => {
    // 【1】判断是否存在git
    if (!shell.which('git')) {
        console.log(logSymbols.error, chalk.redBright('对不起,运行脚本必须先安装git'));
        shell.exit(1);
    }
    // 【2】项目名称是否规范
    if (projectName.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
        console.log(logSymbols.error, chalk.redBright('对不起,项目名称存在非法字符'));
        return;
    }

    // 【3】获取命令行参数的模板，如果没有，让用户选择一个模板
    const chooseTemplate = await getParamsRepo(option.template);
    if (!chooseTemplate) {
        return;
    }

    // 【4】项目存在并且不强制删除。那么提出询问
    if (fs.existsSync(projectName) && !option.force) {
        console.log(logSymbols.error, `已存在项目文件夹${chalk.yellow(projectName)}`);
        const answer = await inquirerConfirm(`是否删除${chalk.yellow(projectName)}文件夹？`);
        // answer.confirm： true-表示要删除
        if (answer.confirm) {
            await removeDir(projectName);
        } else {
            console.log(
                logSymbols.error,
                chalk.redBright(`项目创建失败,存在同名文件夹,${chalk.yellowBright(projectName)}`),
            );
            return;
        }
    }
    if (fs.existsSync(projectName) && option.force) {
        console.log(logSymbols.warning, `已经存在项目文件夹${chalk.yellowBright(projectName)},强制删除`);
        // 删除
        await removeDir(projectName);
    }
    // 【5】克隆远程仓库项目
    try {
        // 克隆项目
        await cloneRepo({
            remote: chooseTemplate,
            fileName: projectName,
        });
        // 修改packagejson信息
        await changePackageJson(projectName);
        // 下载依赖
        await npmInstall(projectName);
        // 自动打开viscode
        await autoOpenViscode(projectName);
    } catch (err) {
        console.log(logSymbols.error, err);
        shell.exit(1); // 下载失败直接退出
    }
};

export default initAction;
