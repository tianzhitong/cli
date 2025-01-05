/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 16:54:05
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-05 17:18:50
 * @FilePath: /cli/src/utils/publish/gitAddVersionTag.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import shell from 'shelljs'
import logSymbols from '../common/logSymbols';
import chalk from 'chalk';

const gitAddVersionTag = async (version: string) => {
    const shellExec = `git add . && git commit -m "build：修改版本号为${version}"`;

    return new Promise((resolve,reject) => {
        shell.exec(shellExec, { silent: true }, (code, stdout, stderr) => {
            if (code !== 0) {
                reject(`${logSymbols.error}${chalk.yellow('git 提交失败' + stderr)}`);
                return;
            }

            console.log('stdout',stdout)
            resolve(stdout);
            // console.log(logSymbols.success, chalk.green(`获取<${packageName}>版本号成功---> ${stdout}`));
        });
    })

}

export default gitAddVersionTag;