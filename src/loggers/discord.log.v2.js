'use strict'
const {Client, GatewayIntentBits } = require('discord.js');
const { model } = require('mongoose');
// const {token_discord, channelId_discord} = process.env;
require('dotenv').config();

class LoggerService{
    constructor(){
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages, 
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages
            ]
        })

        // add channelId
        this.channelId = process.env.DISCORD_CHANNEL_ID;
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });
        this.client.login(process.env.DISCORD_TOKEN);
    }

    sendToMessage(message = 'message'){
        const channel = this.client.channels.cache.get(this.channelId);
        if(!channel){
            console.error('Channel not found!', this.channelId);
            return;
        }

        channel.send(message).cache(e=>console.log('Send message to discord channel successfully!')).catch(e=>console.error('Error when send message to discord channel', e));
    }
}
// const loggerService = new LoggerService();

module.exports = new LoggerService();