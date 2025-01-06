/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-06 01:06:52
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-07 02:00:58
 * @FilePath: /cli/src/utils/apiGenTs/filterNoUseApi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { swaggerListProps } from "../../../apiGenTs";

interface filterNoUseApiProps {
    /** 从服务器获取到的接口列表 */
    fetchGetSwaggerData?: any;
    /** 读取用户的配置文件查看哪些是需要用到的接口 */
    baseSetUseApiList?: swaggerListProps['apis']
}

const filterPathData = (fetchGetSwaggerData: any) => {
    if (Reflect.ownKeys(fetchGetSwaggerData['paths'] ?? {}).length === 0) {
        return fetchGetSwaggerData;
    }
    const paths = fetchGetSwaggerData['paths'];
    for (const apiName in paths) {
        if (Object.prototype.hasOwnProperty.call(paths, apiName)) {
            const currentApiKeys = Reflect.ownKeys(paths[apiName] ?? {});
            currentApiKeys.forEach(requestMethod => {
                // 如果parameters参数没有值，那么删除该属性
                if ((paths?.[apiName]?.[requestMethod]?.['parameters'] ?? []).length === 0) {
                    Reflect.deleteProperty(paths[apiName][requestMethod], 'parameters');
                }
                // 如果data属性只有一个，那么也删除掉
                const requestBody = paths[apiName][requestMethod]['requestBody'];
                const requestBodyKeys = Reflect.ownKeys(requestBody ?? {});
                if (requestBodyKeys.length === 1) {
                    const content = requestBody['content'];
                    const contentKeys = Reflect.ownKeys(requestBody['content']);
                    if (contentKeys.length === 1) {
                        const dataPropertyObj = content[contentKeys[0]];
                        if (typeof dataPropertyObj?.['schema']?.['type'] === 'string' && dataPropertyObj['schema']['type'] === 'object') {
                            const propertiesKeys = Reflect.ownKeys(dataPropertyObj['schema']['properties'] ?? {});
                            if (propertiesKeys.length === 0) {
                                Reflect.deleteProperty(paths[apiName][requestMethod], 'requestBody');
                            }
                        }
                    }

                }
            })
        }
    }

    return fetchGetSwaggerData;
}

const filterNoUseApi = (props: filterNoUseApiProps) => {
    const { fetchGetSwaggerData, baseSetUseApiList } = props;
    const newfetchGetSwaggerData = filterPathData(fetchGetSwaggerData);
    // 远程获取到的接口列表
    const { paths } = newfetchGetSwaggerData;

    // 如果本地需要用到的接口数量为0。那么直接把fetch的接口全部拿过来
    if (Reflect.ownKeys(baseSetUseApiList ?? {}).length === 0) {
        // 对path进行处理
        return fetchGetSwaggerData;
    }

    // 本地配置文件使用的接口。需要转换，然后和fetch的接口做对比
    const beseUseApiList: string[] = [];

    for (const key in baseSetUseApiList) {
        if (Object.prototype.hasOwnProperty.call(baseSetUseApiList, key)) {
            const currnetApiMethodList = (baseSetUseApiList[key] ?? []) as string[];
            currnetApiMethodList.forEach(apiName => {
                beseUseApiList.push(`${key.toLowerCase()}-----${apiName}`)
            })
        }
    };


    const disposeAfterPaths = {};

    // 对接口进行处理，未使用的话。把paths里的接口删除掉
    for (const apiName in paths) {
        if (Object.prototype.hasOwnProperty.call(paths, apiName)) {
            const currentApiKeys = Reflect.ownKeys(paths[apiName] ?? {});
            currentApiKeys.forEach(requestMethod => {
                //fetchApiTransString 可能是多个，也可能是一个，因为有RESTful api的问题
                const fetchApiTransString = `${String(requestMethod)}-----${apiName}`;
                if (beseUseApiList.includes(fetchApiTransString)) {
                    if (!disposeAfterPaths[apiName]) {
                        disposeAfterPaths[apiName] = {};
                    }
                    disposeAfterPaths[apiName][requestMethod] = paths[apiName][requestMethod];
                }
            })
        }
    }

    return { ...fetchGetSwaggerData, paths: disposeAfterPaths }
}

export default filterNoUseApi;