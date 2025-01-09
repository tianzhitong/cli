/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 19:38:35
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 22:52:33
 * @FilePath: /cli/src/utils/cloneRepo.ts
 * @Description: 克隆仓库
 */
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';

interface cloneRepoProps {
    /** 远程仓库地址 */
    remote: string;
    /** 本地文件夹的名字 */
    fileName: string;
    /** 可选项 */
    option?: boolean;
}

/** 克隆项目 */
const cloneRepo = (props: cloneRepoProps): Promise<boolean> => {
    const { remote, fileName, option = false } = props;
    const spinner = ora('正在拉取项目......').start();
    return new Promise((resoleve, reject) => {
        download(remote, fileName, option, (err) => {
            if (err) {
                spinner.fail(chalk.red(err));
                reject(false);
                return;
            }

            spinner.succeed(chalk.green('拉取成功'));
            resoleve(true);
        });
    });
};

export default cloneRepo;
