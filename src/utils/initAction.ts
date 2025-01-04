/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 20:42:31
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 21:24:32
 * @FilePath: /cli/src/utils/initAction.ts
 * @Description: 检测git并且克隆项目
 */
import shell from "shelljs";
import chalk from "chalk";
import fs from "fs-extra"
import logSymbols from './logSymbols.js';
import cloneRepo from "./cloneRepo.js";
import inquirerConfirm from "./interactive.js";
import removeDir from "./removeDir.js";

const initAction = async (name: string, option: any) => {
    // 当前脚本运行时的路径 + 路径分隔符 + 要创建的目录的名字
    // const currentPwdNameDir = join(process.cwd() + sep + name);
    if (!shell.which("git")) {
        console.log(logSymbols.error, chalk.redBright("对不起,运行脚本必须先安装git"));
        shell.exit(1);
    }
    // 验证name输入是否符合规范
    if (name.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
        console.log(logSymbols.error, chalk.redBright("对不起,项目名称存在非法字符"));
        return;
    }

    // 存在并且不强制删除。那么提出询问
    if (fs.existsSync(name) && !option.force) {
        console.log(logSymbols.error, `已存在项目文件夹${chalk.yellow(name)}`);
        const answer = await inquirerConfirm(`是否删除${chalk.yellow(name)}文件夹？`);
        // answer.confirm： true-表示要删除
        if (answer.confirm) {
            await removeDir(name);
        } else {
            console.log(logSymbols.error, chalk.redBright(`项目创建失败,存在同名文件夹,${chalk.yellowBright(name)}`));
            return;
        }
    }
    if (fs.existsSync(name) && option.force) {
        console.log(logSymbols.warning, `已经存在项目文件夹${chalk.yellowBright(name)},强制删除`);
        // 删除
        await removeDir(name);
    }
    // 克隆项目
    console.log('name', name)
    await cloneRepo({
        remote: "yingside/vue-cli-template",
        fileName: name
    });
};

export default initAction;