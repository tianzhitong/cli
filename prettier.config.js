/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-09 19:46:42
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-10 05:49:35
 * @FilePath: /cli/prettier.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// prettier.config.js
/**
 * @type {import('prettier').Config}
 * @see https://www.prettier.cn/docs/options.html
 */
export default {
    trailingComma: 'all',
    singleQuote: true,
    semi: true,
    printWidth: 120,
    arrowParens: 'always',
    proseWrap: 'always',
    endOfLine: 'lf',
    experimentalTernaries: false,
    tabWidth: 4,
    useTabs: false,
    quoteProps: 'consistent',
    jsxSingleQuote: false,
    bracketSpacing: true,
    bracketSameLine: false,
    jsxBracketSameLine: false,
    vueIndentScriptAndStyle: false,
    singleAttributePerLine: false,
};
