/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 22:15:09
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 22:24:16
 * @FilePath: /cli/src/utils/changePackageJson.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from "fs-extra"
import { resolveApp } from "../common/removeDir";
import logSymbols from "../common/logSymbols";
import chalk from "chalk";

const changePackageJson = async (name: string) => {
    try {
        const pkg = await fs.readJson(resolveApp(`${name}/package.json`));
        pkg['name'] = name.trim();
        await fs.writeJson(resolveApp(`${name}/package.json`), pkg, { spaces: 2 })
    } catch (err) {
        console.log(logSymbols.error, chalk.red(err));
    }
}

export default changePackageJson;