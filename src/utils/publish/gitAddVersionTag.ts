/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 16:54:05
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-05 17:58:53
 * @FilePath: /cli/src/utils/publish/gitAddVersionTag.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import shell, { ShellString } from 'shelljs'
import logSymbols from '../common/logSymbols';
import chalk from 'chalk';

const gitAddVersionTag = (version: string) => {
    const gitSubmitMessasge = `build：修改版本号为${version}`;
    const shellExec = `git add . && git commit -m "${gitSubmitMessasge}"`;

    const gitAddResult = shell.exec(shellExec, { silent: true });
    if (gitAddResult.code !== 0) {
        return Promise.reject(`${logSymbols.error}${chalk.yellow('git 提交失败' + gitAddResult.stderr)}`);
    }

    // const getGitCommitList = gitAddResult.stdout.trim().split(gitSubmitMessasge)[0].trim().slice(1, -1);
    // const [_, SHAvalue] = getGitCommitList.split(' ');

    return new Promise((resolve, reject) => {
        shell.exec(`git tag online_${version}`, { silent: true }, (code, stdout, stderr) => {
            if (code !== 0) {
                reject(`${logSymbols.error}${chalk.yellow('git tag创建失败' + stderr)}`);
                return;
            }

            resolve('git 提交成功并且创建tag成功！');
            console.log(logSymbols.success, chalk.green(`git 提交成功并且创建tag成功！`));
        });
    })

}

export default gitAddVersionTag;