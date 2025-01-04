/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 20:53:06
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 22:04:31
 * @FilePath: /cli/src/utils/interactive.ts
 * @Description: 创建单独的模块处理交互相关代码
 */
import inquirer from 'inquirer';

/**
 * 
 * @param message 询问的信息
 * @returns 单个确认框
 */
export const inquirerConfirm = async (message: string): Promise<{ confirm: boolean }> => {
    const answer = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message
    });

    return answer;
}

/**
 * 
 * @param message 
 * @param choices 
 * @param type 
 * @returns 支持多个选择
 */
export const inquirerChoose = async (message: string, choices: any, type: 'list' = 'list') => {
    const answer = await inquirer.prompt({
        type,
        name: "choose",
        message,
        choices,
    });
    return answer;
}


/**
 * @param {string} message 询问提示语句 
 * @returns 输入结果
 */
export const inquirerInput = async (message: string) => {
    const answer = await inquirer.prompt({
        name: 'input',
        type: 'input',
        message
    });
    return answer
}


/*
 * @param {Array} messages 询问提示语句数组 
 * @returns {Object} 结果对象
*/
export const inquirerInputs = async (messages: any[]) => {
    const answers = await inquirer.prompt(messages.map(msg => {
        return {
            name: msg.name,
            type: 'input',
            message: msg.message
        }
    }));
    return answers
}