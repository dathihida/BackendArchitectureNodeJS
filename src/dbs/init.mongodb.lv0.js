'use strict';
const mongoose = require('mongoose');

// const connectString = 'mongodb://localhost:27017/Ecommerce'; 
const connectString = 'mongodb+srv://tiendat:123@cluster0.r2myiyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(connectString).then( _ =>console.log('Connected MongoDB Successfully!'))
.catch(err=>console.error('Error Connect!'));

// dev
if(1 === 0){
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}

module.exports = mongoose
