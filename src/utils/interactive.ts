/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 20:53:06
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 21:24:55
 * @FilePath: /cli/src/utils/interactive.ts
 * @Description: 创建单独的模块处理交互相关代码
 */
import inquirer from 'inquirer';

/**
 * 
 * @param message 询问的信息
 * @returns 
 */
const inquirerConfirm = async (message: string): Promise<{ confirm: boolean }> => {
    const answer = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message
    });

    return answer;
}

export default inquirerConfirm;