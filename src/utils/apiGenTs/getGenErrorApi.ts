/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-08 23:47:07
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-10 06:06:22
 * @FilePath: /cli/src/utils/apiGenTs/getGenErrorApi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import chalk from 'chalk';
import logSymbols from '../common/logSymbols';
import { resolveApp } from '../common/removeDir';
import { pathToFileURL } from 'node:url';
import pkg from 'fs-extra';

const { writeJsonSync, removeSync } = pkg;

const getGenErrorApi = (remoteSwaggerDataList: Map<any, any>) => {
    const noGenerateApi = new Map();
    const keys = Array.from(remoteSwaggerDataList.keys());
    keys.forEach((swaggerSingInfo) => {
        const getSwaggerSpecData = remoteSwaggerDataList.get(swaggerSingInfo);
        noGenerateApi.set(swaggerSingInfo.name, []);
        // 获取构建失败的接口
        const pathMap = Reflect.ownKeys(getSwaggerSpecData?.paths ?? {});
        const getRemoteApiInfo = new Map();
        if (pathMap.length > 0) {
            pathMap.forEach((currentApi) => {
                // 获取到远程接口的所有方法。
                const currentApiRequestMethods = Reflect.ownKeys(getSwaggerSpecData.paths[currentApi]).map((item) =>
                    String(item).toUpperCase(),
                );
                getRemoteApiInfo.set(currentApi, currentApiRequestMethods);
            });
        }
        const currentApiNoFind = noGenerateApi.get(swaggerSingInfo.name);
        Reflect.ownKeys(swaggerSingInfo?.apis ?? {}).forEach((requestMethod) => {
            (swaggerSingInfo.apis[requestMethod] ?? []).forEach((requestUrl) => {
                const remoteRequestApiCurrentMethod = getRemoteApiInfo.get(requestUrl);
                if (!remoteRequestApiCurrentMethod) {
                    // 如果不存在，那么就是没找到当前接口
                    currentApiNoFind.push({
                        method: requestMethod,
                        url: requestUrl,
                    });
                } else {
                    if (!(remoteRequestApiCurrentMethod as any[]).includes(requestMethod)) {
                        // 包含了该接口
                        currentApiNoFind.push({
                            method: requestMethod,
                            url: requestUrl,
                        });
                    }
                }
            });
        });
    });

    // 获取未找到的接口的数量
    let noFindApiNum = 0;
    const getNoGenerateApiKeys = Array.from(noGenerateApi.keys());
    getNoGenerateApiKeys.forEach((item) => {
        noFindApiNum += noGenerateApi.get(item).length;
    });

    const genErrorPath = resolveApp('./apiGenTs.error.json');

    if (noFindApiNum > 0) {
        const genNoUseApiJSON = {};
        getNoGenerateApiKeys.forEach((key) => {
            genNoUseApiJSON[key] = noGenerateApi.get(key);
        });
        writeJsonSync(genErrorPath, genNoUseApiJSON, {
            spaces: 4,
        });
        console.log(logSymbols.error, chalk.yellow(`部分接口构建失败。请查看 ——-->${pathToFileURL(genErrorPath)}`));

        return;
    }

    removeSync(genErrorPath);
};

export default getGenErrorApi;
