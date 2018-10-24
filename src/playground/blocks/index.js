'use strict';

const hardware = require('./hardware/index');

const basicBlockList = [
    require('./block_start'),
    require('./block_flow'),
    require('./block_moving'),
    require('./block_looks'),
    require('./block_brush'),
    require('./block_text'),
    require('./block_sound'),
    require('./block_judgement'),
    require('./block_calc'),
    require('./block_variable'),
    require('./block_func'),
];

Entry.EXPANSION_BLOCK = {};
require('./block_expansion_weather');
require('./block_expansion_festival');
require('./block_expansion_translate');

Entry.EXPANSION_BLOCK_LIST = {
    weather: Entry.Expansion_Weather,
    festival: Entry.EXPANSION_BLOCK.festival,
    translate: Entry.EXPANSION_BLOCK.translate,
};

function getBlockObject(items) {
    const blockObject = {};
    items.forEach((item) => {
        if ('getBlocks' in item) {
            Object.assign(blockObject, item.getBlocks());
        }
    });
    return blockObject;
}

/**
 * 하드웨어 블록을 EntryStatic 에 등록한다.
 * 하드웨어 블록에만 사용하는 이유는,
 * 기존 블록은 legacy 블록이 존재하기 때문에 전부 등록하면 안되기 때문이다.
 * 또한 값블록으로서만 사용하는 블록이 블록메뉴에 따로 나타나게 될 수 있다.
 *
 * block 자체에 ignore: true 프로퍼티가 존재하는 경우 스킵한다.
 *
 * @param {Object} blockList
 * @return {void}
 */
function registerHardwareBlockToStatic(blockList) {
    for (let blockName in blockList) {
        if(blockList[blockName].ignore !== true &&
            EntryStatic.DynamicHardwareBlocks.indexOf(blockName) === -1) {
            EntryStatic.DynamicHardwareBlocks.push(blockName);
        }
    }
}

module.exports = {
    getBlocks() {
        const basicAndExpansionBlockObjectList = getBlockObject(basicBlockList.concat(Object.values(Entry.EXPANSION_BLOCK_LIST)));
        const hardwareBlockObjectList = getBlockObject(hardware.getHardwareModuleList());
        registerHardwareBlockToStatic(hardwareBlockObjectList);

        return Object.assign({}, basicAndExpansionBlockObjectList, hardwareBlockObjectList);
    },
};
