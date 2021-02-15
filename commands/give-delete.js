const ms = require('ms');
const { isPermitted } = require('./utils/isPermitted');
const { findGiveaway } = require('./utils/give-helpers');

const execute = async (message, args, client) => {

    // If the member doesn't have enough permissions
    if (!isPermitted(message, 'MANAGE_MESSAGES', "Giveaways")) {
        return message.channel.send(':x: You need to have the manage messages permissions or the Giveaways role to delete giveaways.');
    }

    // try to found the giveaway with prize then with ID
    try {
        var giveaway = findGiveaway(args, client)
    }
    catch (e) {
        return message.channel.send(e.message)
    }

    // Edit the giveaway
    client.giveawaysManager.delete(giveaway.messageID)
        // Success message
        .then(() => {
            // Success message
            message.channel.send(`Success! Giveaway with message ID ${giveaway.messageID} (prize: ${giveaway.prize}) deleted!');`);
        })
        .catch((e) => {

            console.error(e);
            message.channel.send('An error occured...');

        });

}

module.exports = {
    name: 'give-delete',
    description: 'Delete giveaway',
    arguments: "prize | messageID",
    execute
};