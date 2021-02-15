const ms = require('ms');
const { isPermitted } = require('./utils/isPermitted');
const { findGiveaway } = require('./utils/give-helpers');

const execute = async (message, args, client) => {

    // If the member doesn't have enough permissions
    if (!isPermitted(message, 'MANAGE_MESSAGES', "Giveaways")) {
        return message.channel.send(':x: You need to have the manage messages permissions or the Giveaways role to reroll giveaways.');
    }

    // try to found the giveaway with prize then with ID
    try {
        var giveaway = findGiveaway(args, client)
    }
    catch (e) {
        return message.channel.send(e.message)
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
        .then(() => {
            // Success message
            message.channel.send('Giveaway rerolled!');
        })
        .catch((e) => {
            if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)) {
                message.channel.send('This giveaway is not ended!');
            } else {
                console.error(e);
                message.channel.send('An error occured...');
            }
        });


}

module.exports = {
    name: 'give-reroll',
    description: 'Roll new giveaway winner(s)',
    arguments: "prize | messageID",
    execute
};