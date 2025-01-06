/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-06 03:21:53
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-06 03:48:50
 * @FilePath: /cli/src/utils/apiGenTs/createManyServiceFileBySwaggler.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import pkg from 'fs-extra';
const { writeFileSync } = pkg;
import { configProps } from "../../../apiGenTs"
import { resolveApp } from "../common/removeDir";

/** 第一个变大些，其他小写 */
const toFistLetterLocaleUpperCase = (str: string) => {
    return str[0].toLocaleUpperCase() + str.slice(1);
};

const createManyServiceFileBySwaggler = (swaggerList: configProps['swaggerList']) => {
    const importList = swaggerList.map(item => {
        return `import { Api as ${toFistLetterLocaleUpperCase(item.name)} } from './${item.name}';`;
    });

    const importString = importList.join('\n');
    const importServiceConfigStr = 'import { serviceConfig } from \'@/config/request/swaggerServiceConfig\';';

    const exportApiStr = `export const Api = { ${swaggerList.map(item => toFistLetterLocaleUpperCase(item.name)).join(', ')} };`;
    const exportInstanceListStr = swaggerList.map(({ name,baseUrl }) => `const ${name} = new ${toFistLetterLocaleUpperCase(name)}(warpperServiceConfig(serviceConfig, { name: '${name}', basePath: '${baseUrl ?? ''}' }));`).join('\n');
    const exportInstanceStr = `export const apiInstanceList = [${swaggerList.map(({ name }) => `{ key: '${name}', instance: ${name} }`).join(', ')}];`;
    const exportApiObjStr = `export const api = { ${swaggerList.map(item => `${item.name}`).join(', ')} };`;

    const wrapperServiceConfigFuncString = `const warpperServiceConfig = (apiConfig: any, ctx: { name: string; basePath: string; }) => {
        const newConfig = { ...apiConfig };
        if (newConfig.baseURL) {
            newConfig.baseURL = newConfig.baseURL + ctx.basePath;
        }
        return newConfig;
    };`
    writeFileSync(resolveApp('./src/service/index.ts'), [
        importString,
        importServiceConfigStr,
        exportApiStr,
        wrapperServiceConfigFuncString,
        exportInstanceListStr,
        exportInstanceStr,
        exportApiObjStr
    ].join('\n\n'), {
        flush: true
    });
}

export default createManyServiceFileBySwaggler;