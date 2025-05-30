'use strict'

const {getSelectData, unSelectData} = require('../../utils/index.js');

const findAllDiscountCodesUnSelect = async({
    limit = 50, page = 1, sort = 'ctime', filter , unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unSelectData(unSelect))
        .lean();
    return documents;
}

const findAllDiscountCodesSelect = async({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(unSelect))
        .lean();
    return documents;
}

const checkDiscountExists = async({model, filter}) => {
    return await model.findOne(filter).lean();
}

module.exports = {
    findAllDiscountCodesUnSelect,
    checkDiscountExists,
    findAllDiscountCodesSelect
};