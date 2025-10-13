'use strict'

const {createComment, getCommentsByParentId, deleteComments} = require('../services/comment.service.js');

class CommentController{
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create comment successfully',
            metadata: await createComment(req.body)
        }).send(res);
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get comments successfully',
            metadata: await getCommentsByParentId(req.query)
        }).send(res);
    }

    deleteComments = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete comment successfully',
            metadata: await deleteComments(req.body)
        }).send(res);
    }
}

module.exports = new CommentController();