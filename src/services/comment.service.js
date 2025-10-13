'use strict'
const { NotFoundError } = require('../core/error.response.js');
const Comment = require('../models/comment.model.js');
const { convertObjectIdMongodb } = require('../utils');

/**
 * Key features: Comment service
 * add comment[User/Shop]
 * get a list of comments
 * delete a comment [User/Admin/Shop]
 */
class CommentService{
    static async createComment({
        productId, userId, content, parentCommentId = null
    }){
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })
        let rightValue
        if(parentCommentId){
            // reply comment
            const parentCommentId = await Comment.findById(convertObjectIdMongodb(parentCommentId))
            if(!parentCommentId) throw new NotFoundError(`Comment ${parentCommentId} not found`)
            rightValue = parentCommentId.comment_right
            // updateMany comments
            await Comment.updateMany({
                comment_productId: convertObjectIdMongodb(productId),
                comment_right: {$gt: rightValue}
            },{
                $inc: {comment_right: 2}
            })

            await Comment.updateMany({
                comment_productId: convertObjectIdMongodb(productId),
                comment_left: {$gt: rightValue}
            },{
                $inc: {comment_left: 2}
            })
        }else{
            const maxRightValue = await Comment.findOne({
                comment_productId: convertObjectIdMongodb(productId)
            }, 'comment_right', {sort: {'comment_right': -1}})
            if(maxRightValue){
                rightValue = maxRightValue.comment_right + 1
            }else{
                rightValue = 1
            }
        }

        // insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        
        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId, 
        parentCommentId = null,
        limit = 50,
        offset = 0
    }){
        if(parentCommentId){
            const parent = await Comment.findById(convertObjectIdMongodb(parentCommentId))
            if(!parent) throw new NotFoundError(`Comment ${parentCommentId} not found`)

            const comments = await Comment.find({
                comment_productId: convertObjectIdMongodb(productId),
                comment_left: {$gt: parent.comment_left},
                comment_right: {$lt: parent.comment_right}
            }).select({
                comment_left:1, 
                comment_right:1, 
                comment_content:1, 
                comment_parentId:1
            })
            .sort({comment_left: 1})

            return comments
        }

        const comments = await Comment.find({
                comment_productId: convertObjectIdMongodb(productId),
                comment_parentId: parentCommentId
            }).select({
                comment_left:1, 
                comment_right:1, 
                comment_content:1, 
                comment_parentId:1
            })
            .sort({comment_left: 1})

        return comments
    }

    static async deleteComments({commentId, productId}){
        // check the product exists in the database
        const foundProduct = await findProduct({product_id: productId})
        if(!foundProduct) throw new NotFoundError(`Product with id ${productId} not found`)

        // 1 xac dinh gia tri left, right of comment can xoa
        const comment = await Comment.findById(convertObjectIdMongodb(commentId))
        if(!comment) throw new NotFoundError(`Comment with id ${commentId} not found`)
        
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        // tinh width
        const width = rightValue - leftValue + 1
        // xoa tat ca cac comment con
        await Comment.deleteMany({
            comment_productId: convertObjectIdMongodb(productId),
            comment_left:{$gte: leftValue, $lte: rightValue}
        })
        // cap nhap gia tri left, right
        await Comment.updateMany({
            comment_productId: convertObjectIdMongodb(productId),
            comment_right: {$gt: rightValue}
        },{
            $inc: {comment_right: -width}
        })

        await Comment.updateMany({
            comment_productId: convertObjectIdMongodb(productId),
            comment_left: {$gt: rightValue}
        },{
            $inc: {comment_left: -width}
        })

        return true
    }
}

module.exports = CommentService;