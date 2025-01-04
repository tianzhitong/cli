/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 21:29:11
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 21:55:52
 * @FilePath: /cli/src/utils/getParamsRepo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import chalk from "chalk";
import { GIT_TEMPLATE_LIST, CLI_NAME } from "../config/const"
import logSymbols from "./logSymbols";
import { inquirerChoose } from "./interactive";

/** 获取命令行参数的模板，如果没有，让用户选择一个模板 */
const getParamsRepo = async (paramsChooseTemplateName?: string) => {
    if (typeof paramsChooseTemplateName === 'string' && paramsChooseTemplateName.length > 0) {
        const template = GIT_TEMPLATE_LIST.find(gitTemplate => gitTemplate.name === paramsChooseTemplateName);
        if (!template) {
            console.log(logSymbols.error, `不存在模板：${chalk.yellowBright(paramsChooseTemplateName)}`);
            console.log(`\r\n 运行${logSymbols.arrow} ${chalk.cyanBright(`${CLI_NAME} list`)} 查看所有可用模板\r\n`);
            return;
        }
        return template;
    }
    const answer = await inquirerChoose("请选择一个项目模板拉取", GIT_TEMPLATE_LIST);
    return answer.choose;
}

export default getParamsRepo;