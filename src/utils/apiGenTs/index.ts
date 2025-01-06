/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 22:05:48
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-06 22:37:07
 * @FilePath: /cli/src/utils/apiGenTs/index.ts
 * @Description: 根据配置文件生成ts文件
 */

import chalk from "chalk";
import { configProps } from "../../../apiGenTs";
import logSymbols from "../common/logSymbols";
import { resolveApp } from "../common/removeDir"
import { generateApi } from 'swagger-typescript-api';
import filterNoUseApi from "./filterNoUseApi";
import { API_GEN_TS_THROW_DIR_NAME } from "../../config/const";
import createManyServiceFileBySwaggler from './createManyServiceFileBySwaggler'

const apiGenTs = async () => {
    try {
        // 【1】读取运行目录下的配置文件
        const path = resolveApp('./apiGenTs.config.js');

        const getConfigFileInfo = await import(path).then(fileInfo => fileInfo.default) as configProps;
        if ((getConfigFileInfo?.swaggerList ?? []).length === 0) {
            throw new Error(`${logSymbols.error}${chalk.yellow('获取swaggerList属性失败！')}`);
        }
        // 【2】根据配置文件来生成ts文件
        for (let index = 0; index < getConfigFileInfo.swaggerList.length; index++) {
            const swaggerSingInfo = getConfigFileInfo.swaggerList[index];
            const getSwaggerSpecData = await fetch(swaggerSingInfo.url).then(data => data.json());
            const getNewSpecToSwagger = filterNoUseApi({
                fetchGetSwaggerData: getSwaggerSpecData,
                baseSetUseApiList: swaggerSingInfo.apis
            })


            console.log('templatesDirAddress start')
            const templatesDirAddress = new URL('./templatesDir', import.meta.url);
            console.log('templatesDirAddress start' + templatesDirAddress.pathname)

            await generateApi({
                name: `${swaggerSingInfo.name}.ts`,
                output: API_GEN_TS_THROW_DIR_NAME,
                spec: getNewSpecToSwagger,
                unwrapResponseData: true,
                httpClientType: 'axios',
                templates: templatesDirAddress.pathname,
                url: swaggerSingInfo.url,
            })
        }

        // 动态生成api文件事其他文件调用
        createManyServiceFileBySwaggler(getConfigFileInfo.swaggerList);

        console.log(logSymbols.success, chalk.green(`动态生成ts文件成功！`));
    } catch (ex) {
        console.log('ex', ex)
    }
}

export default apiGenTs