'use strict'
const mongoose = require('mongoose');

// const connectString = 'mongodb://localhost:27017/Ecommerce'; 
const connectString = 
'mongodb+srv://tiendat:123@cluster0.r2myiyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const { countConnect } = require('../helpers/check.connect.js');

class Database{
    constructor(){
        this.connect()
    }

    // connect to mongodb
    // singleton pattern
    connect(type = 'mongodb'){
        // dev environment
        if(1 === 1){
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        mongoose.connect(connectString,{
            maxPoolSize: 100 // cai thien hieu nang, neu vuot 100 thi se xep hang de dc thuc thi
        }).then( _ =>{
            
            console.log(`Connected MongoDB Successfully!`, countConnect())
            // notify.send
            
        })
        .catch(err=>console.error('Error Connect!'));
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance()
module.exports = instanceMongoDB