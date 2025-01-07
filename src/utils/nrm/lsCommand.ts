/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-07 19:00:52
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-07 19:19:10
 * @FilePath: /cli/src/utils/nrm/lsCommand.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
import chalk from "chalk";
import { NRM_LIST } from "../../config/const";
import logSymbols from "../common/logSymbols";
import { table } from "table";
import shell from "shelljs";

const lsCommand = () => {
    shell.exec('npm config get registry', { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
            throw new Error(`${logSymbols.error}${chalk.yellow('获取registry地址失败' + stderr)}`);
        }
        const getCurrentChoosedNrmOrigin = (stdout ?? '').trim();
        const data = NRM_LIST.map(item => {
            const isChoosed = item.value === getCurrentChoosedNrmOrigin;
            return [`${isChoosed ? chalk.bold.redBright('*') : ''}${chalk.bold.greenBright(item.name)}`, chalk.bold.yellowBright(item.value)]
        });
        data.unshift([chalk.whiteBright("名称"), chalk.whiteBright("源地址")]);
        console.log(table(data));
    });
}

export default lsCommand;