/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-09 19:06:44
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-10 06:04:30
 * @FilePath: /cli/eslint.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config([
    {
        ignores: ['node_modules', 'dist', 'public'],
    },
    /** JS 推荐配置 */
    eslint.configs.recommended,
    /** TS 推荐配置 */
    ...tseslint.configs.recommended,
    /** Stylistic 自定义规则 */
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: true,
        jsx: true,
        braceStyle: '1tbs',
        arrowParens: 'always',
    }),
    /** 配置全局变量 */
    {
        languageOptions: {
            globals: {
                ...globals.node,
                /** 追加一些其他自定义全局规则TODO */
            },
        },
    },
    /**
     * TypeScript 规则
     */
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@stylistic/indent-binary-ops': ['off', 4],
            '@stylistic/operator-linebreak': ['off', 'after', { overrides: { '||': 'before' } }],
        },
    },
    eslintPluginPrettierRecommended,
]);
