/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-07 19:21:19
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-07 19:28:03
 * @FilePath: /cli/src/utils/nrm/useCommand.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import shell from 'shelljs'
import logSymbols from '../common/logSymbols';
import chalk from 'chalk';


interface useCommandProps {
    name: string;
    value: string;
}
const useCommand = (props: useCommandProps) => {
    const getSetRegistryUrl = props.value;
    shell.exec(`npm config set registry ${getSetRegistryUrl}`, { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
            throw new Error(`${logSymbols.error}${chalk.yellow('设置registry地址失败' + stderr)}`);
        }
        console.log(`${logSymbols.success}${chalk.green('设置源成功：' + props.name +  '---->' + props.value)}`)
    });
}

export default useCommand;