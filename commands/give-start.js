const ms = require('ms');
const { giveawayConfig } = require("../settings.json")
const { isPermitted } = require('./utils/isPermitted');

const execute = async (message, args, client) => {

    // If the member doesn't have enough permissions
    if (!isPermitted(message, 'MANAGE_MESSAGES', "Giveaways")) {
        return message.channel.send(':x: You need to have the manage messages permissions or the Giveaways role to start giveaways.');
    }

    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();

    //arguments
    let [giveawayDuration, giveawayNumberWinners, ...giveawayPrizeList] = args.slice(1)

    let giveawayPrize = giveawayPrizeList.join(' ');

    // If no channel is mentionned
    if (!giveawayChannel) {
        return message.channel.send(':x: You have to mention a valid channel!');
    }

    // If the duration isn't valid
    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
        return message.channel.send(':x: You have to specify a valid duration!');
    }

    // If the specified number of winners is not a number
    if (isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) {
        return message.channel.send(':x: You have to specify a valid number of winners!');
    }

    // If no prize is specified
    if (!giveawayPrize) {
        return message.channel.send(':x: You have to specify a valid prize!');
    }

    const reaction = giveawayConfig.default.reaction
    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: giveawayNumberWinners,
        // Who hosts this giveaway
        hostedBy: null,
        // Messages
        messages: {
            giveaway: `@everyone\n\n${reaction}  **ITALIANCODERS GIVEAWAY**  ${reaction}`,
            giveawayEnded: `@everyone\n\n${reaction} **GIVEAWAY CONCLUSO** ${reaction}`,
            timeRemaining: "Tempo rimanente: **{duration}**!",
            inviteToParticipate: `Reagisci con ${reaction} per partecipare!`,
            winMessage: "Congratulazioni {winners}! Hai vinto **{prize}**!",
            embedFooter: "ItalianCoders",
            noWinner: "Giveaway annullato, nessuno ha partecipato.",
            hostedBy: "Hosted by: {user}",
            winners: "Vincitore/i",
            endedAt: "Finito il",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });

    message.channel.send(`Il Giveaway è iniziato in ${giveawayChannel}!`);


}

module.exports = {
    name: 'give-start',
    description: 'Start giveaway',
    arguments: "#channel duration numWinners prize",
    execute
};