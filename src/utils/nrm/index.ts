/*
 * @Author: laotianwy 1695657342@qq.com
 * @Date: 2025-01-07 18:50:56
 * @LastEditors: laotianwy 1695657342@qq.com
 * @LastEditTime: 2025-01-07 19:28:35
 * @FilePath: /cli/src/utils/nrm/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { NRM_LIST } from '../../config/const';
import lsCommand from './lsCommand';
import useCommand from './useCommand';

const nrmCommand = (command: string) => {
    if (command === 'ls') {
        lsCommand();
        return;
    }

    const isUseCommand = NRM_LIST.find((item) => item.name === command);
    if (isUseCommand) {
        useCommand(isUseCommand);
        return;
    }
};

export default nrmCommand;
