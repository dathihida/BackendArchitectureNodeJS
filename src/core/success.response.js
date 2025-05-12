'use strict';

const StatusCode = {
    OK: 200,
    CREATED: 201,
}

const ReasonStatusCode = {
    CREATED: 'Create',
    OK: 'Success',
}

class SuccessResponse {
    constructor({ 
        message = ReasonStatusCode.OK,
        statusCode = StatusCode.OK,
        reasonStatusCode = ReasonStatusCode.OK,
        metadata = {} 
    }) {
        this.message = message || reasonStatusCode;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json({
            message: this.message,
            status: this.status,
            metadata: this.metadata,
        });
    }
}

class OK extends SuccessResponse{
    constructor({message, metadata}){
        super({message, metadata});
    }
}

class CREATED extends SuccessResponse{
    constructor({options = {}, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata}){
        super({message, metadata, statusCode, reasonStatusCode})
        this.options = options;
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse
}