const fetch = require('node-fetch');

module.exports = {
    toFetch(Bot,option,tag,option2){
        let token;

        switch(Bot.apiInt){
            case 1:{
                Bot.apiInt++;
                token = Bot.tokens.token1;
            }break;

            case 2:{
                Bot.apiInt++;
                token = Bot.tokens.token2;
            }break;

            case 3:{
                Bot.apiInt++;
                token = Bot.tokens.token3;
            }break;

            case 4:{
                Bot.apiInt = 1;
                token = Bot.tokens.token4;
            }break;
        }

        function  waitEnable(Bot,option,tag,token,option2){
        if(option2){
            const used = Bot.timers.get(Bot.user.id+'api');
            if(used){
                Bot.timers.delete(Bot.user.id+'api');
            }
            const response = fetch('https://api.brawlstars.com/v1/'+option+'/%23'+tag+'/'+option2,{
                method: 'GET',
                headers: {
                    'content-Type': 'application/json',
                    'authorization': 'Bearer '+token
                }
            })
            return response;
        }
        else{
        const response = fetch('https://api.brawlstars.com/v1/'+option+'/%23'+tag,{
                method: 'GET',
                headers: {
                    'content-Type': 'application/json',
                    'authorization': 'Bearer '+token
                }
            })
            return response;
        }
    }
    setTimeout(waitEnable(Bot,option,tag,token,option2),100);
    }
}