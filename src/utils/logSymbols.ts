/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 20:34:27
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-04 20:36:35
 * @FilePath: /cli/src/utils/logSymbols.ts
 * @Description: 打印特殊符号
 */
import chalk from "chalk";
import isUnicodeSupported from "./isUnicodeSupported";

const main = {
    info: chalk.blue("ℹ"),
    success: chalk.green("✔"),
    warning: chalk.yellow("⚠"),
    error: chalk.red("✖"),
    star: chalk.cyan("✵"),
    arrow: chalk.yellow("➦")
};

const fallback = {
    info: chalk.blue("i"),
    success: chalk.green("√"),
    warning: chalk.yellow("‼"),
    error: chalk.red("×"),
    star: chalk.cyan("*"),
    arrow: chalk.yellow("->")
};

const logSymbols = isUnicodeSupported() ? main : fallback;

export default logSymbols;