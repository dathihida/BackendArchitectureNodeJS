'use strict'
require('dotenv').config();
const {Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ] 
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const token = process.env.token_discord;

client.login(token);

client.on('messageCreate', msg => {
    if(msg.author.bot) return;
    if (msg.content === 'hello') {
        msg.reply('Hello! Welcome to DatShop!');
    }
})  