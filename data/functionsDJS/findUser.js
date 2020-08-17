module.exports = {
    find(msg,search){
        const user = msg.guild.members.cache.get(search);
        return user;
    }
}