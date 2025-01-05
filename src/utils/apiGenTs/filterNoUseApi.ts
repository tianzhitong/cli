/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-06 01:06:52
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-06 01:40:57
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

const filterNoUseApi = (props: filterNoUseApiProps) => {
    const { fetchGetSwaggerData, baseSetUseApiList } = props;

    // 如果本地需要用到的接口数量为0。那么直接把fetch的接口全部拿过来
    if (Reflect.ownKeys(baseSetUseApiList ?? {}).length === 0) {
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

    // 远程获取到的接口列表
    const { paths } = fetchGetSwaggerData;

    const disposeAfterPaths = {};

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