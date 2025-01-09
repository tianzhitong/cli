/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-06 03:21:53
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-09 18:48:16
 * @FilePath: /cli/src/utils/apiGenTs/createManyServiceFileBySwaggler.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import fs from 'fs-extra';
import { join, resolve } from 'node:path';
import ejs from 'ejs';
import { fileURLToPath } from 'node:url';
import { configProps } from '../../../apiGenTs';

const createManyServiceFileBySwaggler = (swaggerList: configProps['swaggerList'], outApiDirPath: string) => {
    const dynamicGenPath = resolve(fileURLToPath(import.meta.url), '../templatesDir/dynamic-gen-api-template.ejs');
    const dynamicEjsFileContent = fs.readFileSync(dynamicGenPath);

    const apiNames = (swaggerList ?? []).map((item) => {
        return {
            name: item.name,
            basePath: item.basePath ?? '',
            toUpperCaseName: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        };
    });

    const dynamicGenJsFile = ejs.render(String(dynamicEjsFileContent), {
        apiNames,
    });
    fs.writeFileSync(join(outApiDirPath, 'index.ts'), String(dynamicGenJsFile));
};

export default createManyServiceFileBySwaggler;
