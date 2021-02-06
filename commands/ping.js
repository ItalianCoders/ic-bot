const execute = (message, args, client) => {
    message.reply('pong');
    // message.channel.send('pong');
}

module.exports = {
    name: 'ping',
    description: 'Pongs the ping',
    execute
};