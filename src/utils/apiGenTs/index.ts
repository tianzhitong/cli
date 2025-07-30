/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-05 22:05:48
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-02-16 14:15:24
 * @FilePath: /cli/src/utils/apiGenTs/index.ts
 * @Description: 根据配置文件生成ts文件
 */

import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { configProps } from '../../../apiGenTs';
import logSymbols from '../common/logSymbols';
import { resolveApp } from '../common/removeDir';
import { generateApi } from 'swagger-typescript-api';
import filterNoUseApi from './filterNoUseApi';
import { API_CONFIG_BASE_URL_FILE, API_GEN_TS_THROW_DIR_NAME } from '../../config/const';
import createManyServiceFileBySwaggler from './createManyServiceFileBySwaggler';
import initConfigFileToProject from './createFileToProject';
import getGenErrorApi from './getGenErrorApi';
import { createRemoteMockApi } from './createRemoteMockApi';

const apiGenTs = async () => {
    try {
        const path = fs.existsSync(resolveApp('./apiGenTs.config.js'))
            ? resolveApp('./apiGenTs.config.js')
            : resolveApp('./apiGenTs.config.mjs');

        // 【1】读取运行目录下的配置文件
        // 注意：import导入的路径必须是文件路径。
        const getConfigFileInfo = (await import(pathToFileURL(path).href).then(
            (fileInfo) => fileInfo.default,
        )) as configProps;
        const { outDir = API_GEN_TS_THROW_DIR_NAME } = getConfigFileInfo;

        // 获取扔出接口的目录地址
        const outApiDirPath = resolveApp(outDir);

        if ((getConfigFileInfo?.swaggerList ?? []).length === 0) {
            throw new Error(`${logSymbols.error}${chalk.yellow('获取swaggerList属性失败！')}`);
        }

        const mockApiMapData = new Map();

        const remoteSwaggerDataList = new Map();

        // 添加mock 映射数据
        let mockMapData = {};
        let mockMapNum = 0;

        // 【2】根据配置文件来生成ts文件
        for (let index = 0; index < getConfigFileInfo.swaggerList.length; index++) {
            const swaggerSingInfo = getConfigFileInfo.swaggerList[index];

            // 远程api接口的配置文件
            let getSwaggerSpecData: any;
            if (swaggerSingInfo.url.includes('http')) {
                getSwaggerSpecData = await fetch(swaggerSingInfo.url)
                    .then((data) => data.json())
                    .catch(() => {
                        throw new Error(
                            `${logSymbols.error}${chalk.yellow(`swagger url请求错误 ->> ${swaggerSingInfo.url}`)}`,
                        );
                    });
            } else {
                getSwaggerSpecData = fs.readJsonSync(resolveApp(swaggerSingInfo.url));
            }

            remoteSwaggerDataList.set(swaggerSingInfo, getSwaggerSpecData);

            // 过滤不需要的api
            const getNewSpecToSwagger = filterNoUseApi({
                fetchGetSwaggerData: getSwaggerSpecData,
                baseSetUseApiList: swaggerSingInfo.apis,
            });

            if (getConfigFileInfo?.mockServe?.enable) {
                for (const key in getNewSpecToSwagger?.paths ?? {}) {
                    if (key.includes('{')) {
                        const element = getNewSpecToSwagger.paths[key];
                        const keyList = Object.keys(element ?? {});
                        if (keyList.length === 0) {
                            continue;
                        }

                        keyList.forEach((requestMethod) => {
                            mockMapNum++;
                            const method = requestMethod.toUpperCase();
                            if (Object.keys(mockMapData[method] ?? {}).length === 0) {
                                mockMapData[method] = {};
                            }

                            const getApiBasePath = key.split('{')[0];
                            mockMapData[method][getApiBasePath] = key;
                        });
                    }
                }
            }

            mockApiMapData.set(swaggerSingInfo.name, getNewSpecToSwagger);

            // 借鉴的模板路径
            const templatesDirAddress = resolve(fileURLToPath(import.meta.url), '../templatesDir');

            // 生成接口文件
            await generateApi({
                name: `${swaggerSingInfo.name}.ts`,
                output: outApiDirPath,
                spec: getNewSpecToSwagger,
                unwrapResponseData: true,
                httpClientType: 'axios',
                templates: templatesDirAddress,
                url: swaggerSingInfo.url,
            });
        }

        // 查询config的接口是否被创建成功
        getGenErrorApi(remoteSwaggerDataList);

        // 动态生成api文件事其他文件调用
        createManyServiceFileBySwaggler(getConfigFileInfo?.swaggerList, outApiDirPath);

        // 创建配置文件到项目里去
        await initConfigFileToProject(resolve(outApiDirPath, `../${API_CONFIG_BASE_URL_FILE}`));
        console.log(logSymbols.success, chalk.green(`动态生成ts文件成功！`));

        if (getConfigFileInfo?.mockServe?.enable) {
            if (
                (getConfigFileInfo.mockServe.url ?? '').length === 0 ||
                getConfigFileInfo.mockServe.url.includes('http') === false
            ) {
                throw new Error(`${logSymbols.error}${chalk.yellow('mockServe.url配置错误！')}`);
            }
            await createRemoteMockApi(
                mockApiMapData,
                getConfigFileInfo.mockServe.url,
                getConfigFileInfo.mockServe.projectName,
                getConfigFileInfo.mockServe.modelData,
            );
            fs.writeJsonSync(resolveApp('./apiGenTs.map.json'), mockMapData, {
                spaces: 4,
            });
            console.log(logSymbols.success, chalk.green(`生成映射json成功！`));
            console.log(logSymbols.success, chalk.green(`push mock api to serve 成功！`));
        }else {
            fs.removeSync(resolveApp('./apiGenTs.map.json'));
        }
    } catch (ex) {
        console.log(String(ex));
    }
};

export default apiGenTs;
