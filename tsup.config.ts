/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-04 18:58:49
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-06 18:35:33
 * @FilePath: /npm/cli/tsup.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'tsup'
import { copy } from 'fs-extra';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    minify: false,
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    onSuccess: async () => {
        await copy('src/utils/apiGenTs/templatesDir/', 'dist/templatesDir');
        await copy('src/utils/apiGenTs/runProjectTemplate/','dist/runProjectTemplate')
        console.log('build after copy success')
    }
})