'use strict'
const { NOTI } = require('../models/notification.models.js');

const pushNotiToSync = async({
    type='SHOP-001',
    senderId = 1,
    receiverId = 1,
    options = {}
})=>{
    let noti_content
    if(type === 'SHOP-001'){
        noti_content = `@@@ vừa có sản phẩm mới từ cửa hàng bạn theo dõi. San phẩm: @@@`
    }else if(type === 'PROMOTION-001'){
        noti_content = `@@@ vừa có chương trình khuyến mãi mới. Voucher: @@@`
    }

    const newNoti = await NOTI.create({
        noti_type: type,
        noti_content,
        noti_senderId: senderId,
        noti_receiverId: receiverId,
        noti_options: options
    })
    return newNoti;
}

const listNotiByUser = async({
    userId =1,
    type='ALL',
    isRead = 0,
}) =>{
    const match = {noti_receiverId: userId};
    if(type !=='ALL'){
        match['noti_type'] = type;
    }

    return await NOTI.aggregate([
        { $match: match },
        {$project:{
            noti_type:1,
            noti_senderId:1,
            noti_receiverId:1,
            noti_content:{
                $concat:[
                    {
                        $substr:['$noti_options.shope_name',0,-1]
                    }, 
                    ' vừa có sản phẩm mới từ cửa hàng bạn theo dõi. ',
                    {$substr:['$noti_options.product_name',0,-1]}
                ]
            },
            createdAt:1,
            noti_options:1
        }}
    ])
}

module.exports = {
    pushNotiToSync,
    listNotiByUser
}