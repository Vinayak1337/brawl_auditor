const Discord = require('discord.js');
const fs = require('fs');

module.exports = (Bot) => {
    console.log(`Logged in as ${Bot.user.tag}`);
    let data = JSON.parse(fs.readFileSync('./data/database/serversPremium.csv','utf8'));
    let pdata = JSON.parse(fs.readFileSync('./data/database/playersPremium.csv','utf8'));
    Bot.guilds.cache.forEach(guild => {
    if(!data[guild.id]){
        data[guild.id] = {
            premium: false
        }
    }
    else{
        if(!data[guild.id].premium){
            data[guild.id].premium = false;
        }
    }
    guild.members.cache.forEach(m => {
        if(!pdata[m.id]){
            pdata[m.id] = {
                premium: false
            }
        }
        else{
            if(!pdata[m.id].premium){
                pdata[m.id].premium = false;
            }
        }
    })
    fs.writeFile('./data/database/serversPremium.csv',JSON.stringify(data), error =>{
        if(error){
            console.log(error);
        }
    })
    fs.writeFile('./data/database/playersPremium.csv',JSON.stringify(pdata), error =>{
        if(error){
            console.log(error);
        }
    })
})
    x = 0;
    setInterval(function(){
        switch(x){
            case 0:{
                Bot.user.setPresence({status: 'online', activity:{name: `Under construction`, type: 'WATCHING'}})
            }break;

            case 1:{
                Bot.user.setPresence({status: 'idle', activity: {name: 'Brawl Stars!', type: 'PLAYING'}})
            }break;

            case 2:{
                Bot.user.setPresence({status: 'dnd', activity: {name: 'commands!', type: 'LISTENING'}})
            }break;

            case 3:{
                Bot.user.setPresence({status: 'dnd', activity: {name: '$help for help!', type: 'PLAYING'}})
            }break;

            default: {
                x = 0;
            }
            
        }
        x++
    },10000)
}