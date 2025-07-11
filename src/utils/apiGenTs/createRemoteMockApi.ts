/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-24 15:33:02
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-02-28 00:01:23
 * @FilePath: /cli/src/utils/apiGenTs/createRemoteMockApi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const apiRefDeepMap = {};

/** 如果接口的请求类型是这些，那么不生成 */
const ignoreApiMethodList = ['parameters'];

export const createRemoteMockApi = async (
    mockApiMapData: Map<string, any>,
    apiBaseUrl: string,
    projectName: string = 'default',
    modelData?: object,
) => {
    const keys = Array.from(mockApiMapData.keys());
    const sendApiData = [];
    keys.forEach((item) => {
        const getFilterApiData = mockApiMapData.get(item);
        const apis = getFilterApiData.paths;
        const pushServerData = [];
        if (apis) {
            const apiKeys = Object.keys(apis);
            apiKeys.forEach((apiUrl) => {
                const apiMethods = Object.keys(apis[apiUrl]);
                for (let index = 0; index < apiMethods.length; index++) {
                    const method = apiMethods[index];
                    if (ignoreApiMethodList.includes(method)) {
                        continue;
                    }
                    const responseToTockStructData = {};
                    const completeURL = apiUrl + method;
                    apiRefDeepMap[completeURL] = {};
                    const response200Res = apis[apiUrl][method]['responses']?.['200'];
                    const keyValueList = Object.keys(apis[apiUrl][method]['responses']?.['200']?.content ?? {});

                    const response = apis[apiUrl][method]['responses']?.['200']?.content?.['application/json']
                        ? apis[apiUrl][method]['responses']?.['200']?.content?.['application/json']
                        : keyValueList.length === 1
                          ? apis[apiUrl][method]['responses']?.['200']?.content?.[keyValueList[0]]
                          : apis[apiUrl][method]['responses']?.['200']?.content?.['application/json'];

                    if (response200Res || response) {
                        const item = response200Res?.schema ? response200Res?.schema : response?.schema;
                        // 胜男apijson特殊操作
                        if (item?.['$ref']) {
                            const firstref = item['$ref'].split('/').filter((item) => item !== '#');
                            const firstStructData = getNestedData(getFilterApiData, firstref);
                            if (firstStructData?.type === 'object') {
                                Object.keys(firstStructData?.properties ?? {}).forEach((key) => {
                                    responseToTockStructData[key] = progressModel(
                                        firstStructData.properties,
                                        key,
                                        getFilterApiData,
                                        completeURL,
                                    );
                                });
                            }
                        } else if (response?.schema) {
                            if ((response.schema?.allOf ?? []).length > 0) {
                                response.schema?.allOf.forEach((item) => {
                                    if (item['$ref']) {
                                        const firstref = item['$ref'].split('/').filter((item) => item !== '#');
                                        const firstStructData = getNestedData(getFilterApiData, firstref);
                                        if (firstStructData?.type === 'object') {
                                            Object.keys(firstStructData?.properties ?? {}).forEach((key) => {
                                                responseToTockStructData[key] = firstStructData.properties[key]['type'];
                                            });
                                        }
                                    }
                                    if (item['properties']) {
                                        Object.keys(item['properties']).forEach((key) => {
                                            const result = progressModel(
                                                item['properties'],
                                                key,
                                                getFilterApiData,
                                                completeURL,
                                            );
                                            responseToTockStructData[key] = result;
                                        });
                                    }
                                });
                            }
                        } else if (item?.type === 'object' && Object.keys(item.properties).length > 0) {
                            Object.keys(item?.properties ?? {}).forEach((key) => {
                                responseToTockStructData[key] = progressModel(
                                    item.properties,
                                    key,
                                    getFilterApiData,
                                    completeURL,
                                );
                            });
                        }
                    }
                    const mockServeData = {
                        projectName,
                        apiUrl,
                        apiMethod: method.toUpperCase(),
                        responseToTockStructData: JSON.stringify(responseToTockStructData),
                    };
                    pushServerData.push(mockServeData);
                }
            });

            sendApiData.push(...pushServerData);
        }
    });

    await fetch(`${apiBaseUrl}/mock/mock/createMockApi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            list: sendApiData,
        }),
    }).then((response) => response.json());

    await fetch(`${apiBaseUrl}/mock/responseModel/editResponseModel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: projectName,
            modelData: modelData ? JSON.stringify(modelData) : '{}',
        }),
    }).then((response) => response.json());
};

const getNestedData = (data: any, keys: string[]) => {
    let result = data;
    for (const key of keys) {
        if (result && result[key] !== undefined) {
            result = result[key];
        } else {
            return undefined; // 或者返回一个默认值
        }
    }
    return result;
};

/**
 *
 * @param data {
  code: { type: 'integer', example: 200 },
  msg: { type: 'string', example: '' },
  data: { type: 'array', items: { type: 'object', properties: [Object] } }
}
 * @param parentKey code
 * @param getFilterApiData swagger数据
 * @param completeURL /banners/get
 * @returns
 */
const progressModel = (data: any, parentKey: string, getFilterApiData: any, completeURL: string) => {
    const result = {};
    if (data[parentKey]['type'] !== 'object' && data[parentKey]['type'] !== 'array' && data[parentKey]['type']) {
        return data[parentKey]['type'];
    }
    if (data?.[parentKey]?.['$ref'] || data[parentKey]['type'] === 'object') {
        if (data?.[parentKey]?.['$ref']) {
            if (!result[parentKey]) {
                result[parentKey] = {};
            }
            const firstref = data?.[parentKey]?.['$ref'].split('/').filter((item) => item !== '#');
            const firstStructData = getNestedData(getFilterApiData, firstref);
            Object.keys(firstStructData['properties']).forEach((key) => {
                const currentKeyValue = progressModel(
                    firstStructData['properties'],
                    key,
                    getFilterApiData,
                    completeURL,
                );
                result[parentKey][key] = currentKeyValue;
            });
            return result[parentKey];
        } else if (!data[parentKey]?.['properties']) {
            return result;
        }
        Object.keys(data[parentKey]['properties']).forEach((key) => {
            if (!result[parentKey]) {
                result[parentKey] = {};
            }
            result[parentKey][key] = progressModel(data[parentKey]['properties'], key, getFilterApiData, completeURL);
        });

        return result[parentKey];
    }

    if (data[parentKey]['type'] === 'array') {
        const items = data[parentKey]['items'];
        if (items?.['type'] === 'array' && items?.['items']?.['$ref']) {
            if (!result[parentKey]) {
                result[parentKey] = [{}];
            }
            const firstref = items?.['items']?.['$ref'].split('/').filter((item) => item !== '#');
            const lastRefName = firstref[firstref.length - 1];
            if (typeof apiRefDeepMap[completeURL][lastRefName] === 'undefined') {
                apiRefDeepMap[completeURL][lastRefName] = 0;
            } else {
                apiRefDeepMap[completeURL][lastRefName] += 1;
            }
            if (apiRefDeepMap[completeURL][lastRefName] === 1) {
                return [];
            }
            // TODO:此处需要在看。因为递归原因，导致内存爆了。
            const firstStructData = getNestedData(getFilterApiData, firstref);
            Object.keys(firstStructData['properties']).forEach((key) => {
                result[parentKey][0][key] = progressModel(
                    firstStructData['properties'],
                    key,
                    getFilterApiData,
                    completeURL,
                );
            });
            return result[parentKey];
        } else if (items?.['type'] === 'object' && items?.['items']?.['$ref']) {
            if (!result[parentKey]) {
                result[parentKey] = {};
            }
            const firstref = items?.['items']?.['$ref'].split('/').filter((item) => item !== '#');
            // TODO:此处需要在看。因为递归原因，导致内存爆了。
            const firstStructData = getNestedData(getFilterApiData, firstref);
            Object.keys(firstStructData['properties']).forEach((key) => {
                result[parentKey][key] = progressModel(
                    firstStructData['properties'],
                    key,
                    getFilterApiData,
                    completeURL,
                );
            });
            return result[parentKey];
        } else if (items['$ref']) {
            const firstref = items['$ref'].split('/').filter((item) => item !== '#');
            const lastRefName = firstref[firstref.length - 1];
            if (typeof apiRefDeepMap[completeURL][lastRefName] === 'undefined') {
                apiRefDeepMap[completeURL][lastRefName] = 0;
            } else {
                apiRefDeepMap[completeURL][lastRefName] += 1;
            }
            if (apiRefDeepMap[completeURL][lastRefName] === 1) {
                return [];
            }
            // TODO:此处需要在看。因为递归原因，导致内存爆了。
            const firstStructData = getNestedData(getFilterApiData, firstref);
            if (!result[parentKey]) {
                result[parentKey] = [{}];
            }
            Object.keys(firstStructData['properties']).forEach((key) => {
                result[parentKey][0][key] = progressModel(
                    firstStructData['properties'],
                    key,
                    getFilterApiData,
                    completeURL,
                );
            });
            return result[parentKey];
        } else if (items?.['type'] != undefined && items?.['type'] !== 'object') {
            return [items?.['type']];
        } else if (items?.['type'] === 'object') {
            if (!result[parentKey]) {
                result[parentKey] = [{}];
            }
            Object.keys(items['properties']).forEach((key) => {
                result[parentKey][0][key] = progressModel(items['properties'], key, getFilterApiData, completeURL);
            });
            return result[parentKey];
        }
    }
    return result;
};
