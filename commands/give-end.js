const ms = require('ms');
const { isPermitted } = require('./utils/isPermitted');
const { findGiveaway } = require('./utils/give-helpers');

const execute = async (message, args, client) => {

    // If the member doesn't have enough permissions
    if (!isPermitted(message, 'MANAGE_MESSAGES', "Giveaways")) {
        return message.channel.send(':x: You need to have the manage messages permissions or the Giveaways role to end giveaways.');
    }

    // try to found the giveaway with prize then with ID
    try {
        var giveaway = findGiveaway(args, client)
    }
    catch (e) {
        return message.channel.send(e.message)
    }

    // Edit the giveaway
    client.giveawaysManager.edit(giveaway.messageID, {
        setEndTimestamp: Date.now()
    })
        // Success message
        .then(() => {
            // Success message
            message.channel.send('Giveaway will end in less than ' + (client.giveawaysManager.options.updateCountdownEvery / 1000) + ' seconds...');
        })
        .catch((e) => {
            if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)) {
                message.channel.send('This giveaway is already ended!');
            } else {
                console.error(e);
                message.channel.send('An error occured...');
            }
        });

}

module.exports = {
    name: 'give-end',
    description: 'End giveaway',
    arguments: "prize | messageID",
    execute
};