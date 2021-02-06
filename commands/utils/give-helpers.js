const ms = require('ms');


module.exports.findGiveaway = (args, client) => {

    // If no message ID or giveaway name is specified
    if (!args[0]) {
        throw Error(":x: You have to specify a valid message ID!")
    }

    // try to found the giveaway with prize then with ID
    let giveaway =
        // Search with giveaway prize
        client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
        // Search with giveaway ID
        client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if (!giveaway) {
        throw Error('Unable to find a giveaway for `' + args.join(' ') + '`.');
    }

    return giveaway

}