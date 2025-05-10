'use strict';

const StatusCode = {
    OK: 200,
    CREATE: 201,
}

const ReasonStatusCode = {
    CREATE: 'Create',
    OK: 'Success',
}

class SuccessResponse{
    constructor(message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {}){
        this.message = !message ? ReasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}){
        return res.status(this.status).json(this);
    }
}

class Ok extends SuccessResponse{
    constructor({message, metadata}){
        super({message, metadata});
    }
}

class CREATE extends SuccessResponse{
    constructor({options = {},message, statusCode = StatusCode.CREATE, reasonStatusCode = ReasonStatusCode.CREATE, metadata}){
        super({message, metadata, statusCode, reasonStatusCode})
        this.options = options;
    }
}

module.exports = {
    Ok,
    CREATE
}