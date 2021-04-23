const Discord = require('discord.js');
const bot = new Discord.Client();

const token = '';

bot.login(token);

let PREFIX = '!';

let version = '1.2';

let data = ' ';

let fs = require("fs");

let curId;

let tempServers = [];

let tallyScore = [];// 1
let isMuted = false;//2

let fullVars = [];


function setVars() {
    fs.readFile("baseVar.txt", function (err, buf) {
        tempServers = buf.toString().split(",");
        for (let i = 0; i < tempServers.length; i++) {
            fs.readFile("vars/" + tempServers[i] + ".txt", function (err, tuf) {

                fullVars[i] = tuf.toString().split('\n');
                for (let m = 0; m < fullVars[i].length; m++) {
                    fullVars[i][m] = fullVars[i][m].split(" ");

                    for (let l = 0; l < fullVars[i][m].length; l++) {
                        fullVars[i][m][l] = fullVars[i][m][l].split(",");

                    }
                }
            });
        }
    });
}

setVars();





bot.on('ready', () => {
    console.log('bot is online ');
    bot.user.setActivity("amazing games");

});





bot.on('message', message => {

    if (getServerId(message.guild.id) == undefined) {
        let temp = tempServers.join();
        temp += "," + message.guild.id;
        fs.writeFileSync("baseVar.txt", temp, (err) => {
            if (err) console.log(err);
        });

        let file = message.guild.id + " " + message.guild.name + "\n\nfalse isMuted\n! PREFIX";
        fs.writeFileSync("vars/" + message.guild.id + ".txt", file, (err) => {
            if (err) console.log(err);
        });

        message.channel.send("Hi i'm new, do !help to get started");

        setVars();

    } else {



        data = ' ';


        tempId = getServerId(message.guild.id);

        tallyScore = fullVars[tempId][1];
        isMuted = fullVars[tempId][2];
        let PREFIXTemp = fullVars[tempId][3];
        PREFIX = PREFIXTemp[0];
        //console.log(PREFIXTemp);






        // console.log( message.guild.roles.cache.find(role => role.name === "Tally"));
        let ADMIN_ROLE;
        let TALLY_ROLE;
        try {
            TALLY_ROLE = message.guild.roles.cache.find(role => role.name === "Tally").id;
        } catch (err) {
            message.channel.send('sorry we cant seem to find a "Tally" role please make sure you have one and its spelt exactly like this : "Tally"');
        }


        try {
            ADMIN_ROLE = message.guild.roles.cache.find(role => role.name === "Admin").id;
        } catch (err) {
            try {
                ADMIN_ROLE = message.guild.roles.cache.find(role => role.name === "ADMIN").id;
            } catch (err) {
                try {
                    ADMIN_ROLE = message.guild.roles.cache.find(role => role.name === "admin").id;
                } catch (err) {
                    message.channel.send('sorry we cant find an admin role. if you have one make sure its spelt correctly like the following example (ADMIN , Admin , admin)');
                }
            }
        }

        let args = message.content.split(" ");

        if (isMuted == true && args[0] != PREFIX + 'mute') {
            message.delete();
        } else {

            switch (args[0]) {

                /* case PREFIX + 'mute':
     
                     if (message.member.roles.cache.has(ADMIN_ROLE) != true) {
                         message.reply('sorry you dont have the requerd permisions to u this command');
                     } else {
     
                         isMuted = !isMuted;
                         message.channel.send('server muted = ' + isMuted);
                     }
                     break; */

                case PREFIX + 'prefix':

                    if (message.member.roles.cache.has(ADMIN_ROLE) != true) {
                        message.reply('sorry you dont have the requerd permisions to u this command');
                    } else {
                        if (args[1] != undefined) {
                            if (args[1].length < 4) {
                                PREFIXTemp[0] = args[1];
                                message.guild.me.setNickname('(' + args[1] + ') TennoBot');
                                message.reply('The prefix has been changed to (' + args[1] + ').')
                            } else {
                                message.reply("sorry the prefix (" + args[1] + ") is too long the max amount is three");
                            }
                        } else {
                            message.reply('please specify a new prefix');
                        }
                    }
                    break;



                case PREFIX + 'poll':
                    message.channel.bulkDelete(1);
                    let pollMessage = '';
                    for (let i = 1; i < args.length; i++) {
                        pollMessage += ' ' + args[i];
                    }
                    message.channel.send('**POLL: **' + pollMessage).then(Message => {
                        Message.react('✅');
                        Message.react('❌');
                    });
                    break;

                case PREFIX + 'poll1':
                    let poll1React = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
                    message.channel.bulkDelete(1);
                    let poll1Message = '';
                    for (let i = 2; i < args.length; i++) {
                        poll1Message += ' ' + args[i];
                    }
                    message.channel.send('**POLL: **' + poll1Message).then(Message => {
                        for (let i = 0; i < args[1]; i++) {
                            Message.react(poll1React[i]);
                        }
                    }
                    );
                    break;

                case PREFIX + 'rolldice':
                case PREFIX + 'dice':
                    diceFaces = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
                    let mess = '**I roled : **';
                    let numOfDice = args[1];
                    let manySides = args[2];
                    if (args[1] == undefined) { numOfDice = 1; manySides = 6; }
                    if (args[2] == undefined) { manySides = 6; }
                    if (manySides > 10) { message.channel.send('sorry you cant have more than 10 sides'); manySides = 10; }
                    for (let i = 0; i < args[1]; i++) {
                        mess += diceFaces[between(0, manySides)] + '   ';
                    }
                    message.channel.send(mess);
                    break;





                case PREFIX + 'cls':
                case PREFIX + 'del':

                    if (message.member.roles.cache.has(ADMIN_ROLE) != true) {
                        message.reply('sorry you dont have the requerd permisions to u this command');
                    } else {

                        let amountDel = parseInt(args[1]);
                        if (args[1] == undefined) {
                            message.channel.bulkDelete(100);
                        } else if (amountDel > 100) {
                            for (let i = 0; i < amountDel / 100; i++) {
                                message.channel.bulkDelete(100);
                            }
                        } else {
                            message.channel.bulkDelete(amountDel);
                        }

                    }
                    break;

                case PREFIX + 'prefix':

                    if (message.member.roles.cache.has(ADMIN_ROLE) != true) {
                        message.reply('sorry you dont have the requerd permisions to u this command');
                    } else {

                        PREFIX = args[2];

                    }
                    break;

                case PREFIX + 'help':
                    switch (args[1]) {
                        case undefined:
                            message.channel.send('here are some commands you can do:');
                            message.channel.send('cls/del , poll , poll1 , mute , tally , rand , rolldice/dice');
                            message.channel.send('to get more detailed information about each command do !help <command>');
                            break;

                        case 'rolldice':
                        case 'dice':
                            message.channel.send('this command allows you to roll one or more dice it is used like this:');
                            message.channel.send('.!rolldice/dice <number of dice>');
                            break;

                        case 'prefix':
                            message.channel.send('this command allows you to change the prefix to the bot instead of the defult "!" it is used like this:');
                            message.channel.send('.!prefix <new prefix>');
                            break;

                        case 'del':
                        case 'cls':
                            message.channel.send('this command alows you to bulk delete messages it is used like this:');
                            message.channel.send('.!del(or cls) <number of messages to delete>');
                            message.channel.send('if the second argument is left blank it will atomaticly delte 100 messages.');
                            break;

                        case 'poll':
                            message.channel.send('this command is used to generate a simple "yes" or "no" poll it is used like this');
                            message.channel.send(':!poll <message>');
                            break;

                        case 'poll1':
                            message.channel.send('this command generates a multi choice question with up to 10 answer it is used like this:');
                            message.channel.send(':!poll1 <the number of questions (1 - 10)> <your message>');
                            break;

                        case 'rand':
                            message.channel.send('this command will pick a random number or word or tally memebr it is used like this:');
                            message.channel.send(':!poll <arg1> <arg1> ');
                            message.channel.send('1. !poll "num" if only arg1 is filled with a number bot will display a random number from 0 to <arg1>');
                            message.channel.send('2. !poll "num" "num" if arg1 and arg2 are both filled with numbers it will pick a number from <arg1> to <arg2>');
                            message.channel.send('3. !poll tally if arg1 is "tally" it will choose a random person from the tally');
                            message.channel.send('4. !poll "word" "word" "word" if you have no numbers and any amount of words than it will randomly select one of the words');
                            break;

                        case 'mute':
                            message.channel.send('this alows you to mute the channel (WARNING: this is not perfect if spammed some messages can get through, this is for temperarily muting a chat) it is used like this');
                            message.channel.send(':!mute');
                            message.channel.send('if unmuted the channel will mute if this is used and if muted the channel will unmute when this is used');
                            break;

                        case 'tally':
                            switch (args[2]) {
                                case undefined:
                                    message.channel.send('this allows you to make a simple tally system these are some commands you can use with it: ');
                                    message.channel.send(':!tally new , !tally remove !tally , !tally score , !tally remove !tally add , !tally minus !tally set , !tally reset , !tally refresh.');
                                    message.channel.send('to get more detailed instructions for each command do "!help tally <command>"');
                                    break;

                                case 'new':
                                    message.channel.send('this command allows you to add people into the tally it is used like this:');
                                    message.channel.send('-!tally new <name> <defult point> if the point value is left empte it will set it to "0"');
                                    break;

                                case 'remove':
                                    message.channel.send('this command allows you to remove people from the tally it is used like this:');
                                    message.channel.send('-!tally remove <name>');
                                    break;

                                case 'score':
                                    message.channel.send('this will display all the people on the tally it does the same as "!tally" it is used like this:');
                                    message.channel.send('-!tally score (you do not need to add score at the end it will do the same thing)');
                                    break;

                                case 'add':
                                    message.channel.send('this command allows you to add an amount of points to a person in the tally it is used like this:');
                                    message.channel.send('-!tally add <name> <amount>');
                                    break;

                                case 'minus':
                                    message.channel.send('this command allows you to subtract an amount of points from a person in the tally it is used like this:');
                                    message.channel.send('-!tally minus <name> <amount>');
                                    break;

                                case 'set':
                                    message.channel.send('this command allows you to set an amount of points of a person in the tally it is used like this:');
                                    message.channel.send('-!tally set <name> <amount>');
                                    break;

                                case 'reset':
                                    message.channel.send('this command will reset the tally it is used like this:');
                                    message.channel.send('-!tally reset');
                                    break;

                                case 'refresh':
                                    message.channel.send('if the tally is not dissplaying the scores in order this command should fix it:');
                                    message.channel.send('-!tally refresh');
                                    break;

                            }
                            break;


                    }
                    break;

                case PREFIX + 'tally':

                    switch (args[1]) {
                        case 'new':

                            if (message.member.roles.cache.has(TALLY_ROLE) != true) {
                                message.reply('sorry you dont have the requerd permisions to u this command');
                            } else {

                                message.channel.bulkDelete(1);
                                if (args[3] == undefined) {
                                    tallyScore.push([args[2], 0]);
                                    message.channel.send('**' + args[2] + '** has been added to the tally.');
                                } else if (isNaN(parseInt(args[3]))) {
                                    message.channel.send('sorry we had a problem trying to add that person you might have tried to add a letter as score value');
                                } else {
                                    tallyScore.push([args[2], parseInt(args[3])]);
                                    message.channel.send('**' + args[2] + '** has been added to the tally with score of: **' + args[3] + '**');
                                }
                                refreshTally();

                            }
                            break;

                        case 'score':
                        case undefined:
                            message.channel.send('**SCORES:**');
                            refreshTally();
                            for (let i = 0; i < tallyScore.length; i++) {
                                message.channel.send(tallyScore[i][0] + ': ' + tallyScore[i][1]);
                            }
                            break;

                        case 'reset':

                            if (message.member.roles.cache.has(TALLY_ROLE) != true) {
                                message.reply('sorry you dont have the requerd permisions to u this command');
                            } else {

                                message.channel.bulkDelete(1);
                                message.channel.send('the tally has been reset');
                                tallyScore = [];
                            }
                            break;

                        case 'remove':

                            if (message.member.roles.cache.has(TALLY_ROLE) != true) {
                                message.reply('sorry you dont have the requerd permisions to u this command');
                            } else {

                                if (getUserIndex(args[2], 'isIn') == false) {
                                    message.channel.send("sorry we couldn't find the person you were looking for");
                                } else {
                                    for (let i = getUserIndex(args[2], 'index'); i < tallyScore.length; i++) {
                                        tallyScore[i] = tallyScore[i + 1];
                                        if (i == tallyScore.length - 1) {
                                            tallyScore.pop();
                                            message.channel.send('**' + args[2] + "** has been removed from the tally");
                                        }
                                    }
                                }
                            }
                            break;

                        case 'add':

                            if (message.member.roles.cache.has(TALLY_ROLE) != true) {
                                message.reply('sorry you dont have the requerd permisions to u this command');
                            } else {

                                message.channel.bulkDelete(1);
                                if (getUserIndex(args[2], 'isIn') == true) {
                                    tallyScore[getUserIndex(args[2], 'index')][1] += parseInt(args[3]);
                                    message.channel.send('**' + args[2] + "'s** points has been increased by **" + args[3] + '** points');
                                } else {
                                    message.reply('sorry it doesnt seem that ' + args[2] + ' is in the tally');
                                }
                                refreshTally();
                            }
                            break;

                        case 'minus':

                            if (message.member.roles.cache.has(TALLY_ROLE) != true) {
                                message.reply('sorry you dont have the requerd permisions to u this command');
                            } else {

                                message.channel.bulkDelete(1);
                                if (getUserIndex(args[2], 'isIn') == true) {
                                    tallyScore[getUserIndex(args[2], 'index')][1] -= parseInt(args[3]);
                                    message.channel.send('**' + args[2] + "'s** points has been reduced by **" + args[3] + '** points');
                                } else {
                                    message.reply('sorry it doesnt seem that ' + args[2] + ' is in the tally');
                                }
                                refreshTally();
                            }
                            break;

                        case 'set':

                            if (message.member.roles.cache.has(TALLY_ROLE) != true) {
                                message.reply('sorry you dont have the requerd permisions to u this command');
                            } else {

                                message.channel.bulkDelete(1);
                                if (getUserIndex(args[2], 'isIn') == true) {
                                    tallyScore[getUserIndex(args[2], 'index')][1] = parseInt(args[3]);
                                    message.channel.send('**' + args[2] + "'s** points has been set to **" + args[3] + '** points');
                                } else {
                                    message.reply('sorry it doesnt seem that ' + args[2] + ' is in the tally');
                                }
                                refreshTally();
                            }
                            break;

                        case 'refresh':

                            if (message.member.roles.cache.has(TALLY_ROLE) != true) {
                                message.reply('sorry you dont have the requerd permisions to u this command');
                            } else {

                                message.reply('refreshed the tally');
                                refreshTally();
                            }
                            break;


                    }

                    break;

                case PREFIX + 'rand':
                    if (args[1] == 'tally') {

                        message.channel.send('the person chosen from the tally is: **' + tallyScore[Math.round(Math.random() * (tallyScore.length - 1 - 0 + 0))][0] + '**');

                    } else if (args[2] == undefined && !isNaN(args[1])) {

                        message.channel.send('the number chosen is **' + Math.round(Math.random() * (parseInt(args[1]) - 0 + 0)) + '**');

                    } else if (isNaN(args[1])) {

                        message.channel.send('**' + args[Math.round(Math.random() * ((args.length - 1) - 1) + 1)] + '** was chosen');

                    } else if (!isNaN(args[1])) {

                        message.channel.send('the number chosen is : **' + Math.round(Math.random() * (parseInt(args[2]) - parseInt(args[1])) + parseInt(args[1])) + '**');

                    }
                    break;
            }
        }


        fullVars[tempId][1] = tallyScore;
        fullVars[tempId][2] = isMuted;
        fullVars[tempId][3] = PREFIXTemp;

        for (let i = 0; i < fullVars[tempId].length; i++) {
            for (let m = 0; m < fullVars[tempId][i].length; m++) {

                if (i == 0 && m == 0) {
                    data = fullVars[tempId][i][m];
                } else if (m != 0) {
                    data += ' ' + fullVars[tempId][i][m];
                } else {
                    data += fullVars[tempId][i][m];
                }
            }
            if (i != fullVars[tempId].length - 1) {
                data += '\n';
            }
        }



        fs.writeFile("vars/" + message.guild.id + ".txt", data, (err) => {
            if (err) console.log(err);
        });

    }

});







function refreshTally() {

    let tempVal = [];
    let restart = false;

    for (let i = 0; i < tallyScore.length; i++) {

        if (i != tallyScore.length - 1) {
            if (tallyScore[i][1] < tallyScore[i + 1][1]) {
                tempVal = tallyScore[i];
                tallyScore[i] = tallyScore[i + 1];
                tallyScore[i + 1] = tempVal;
                restart = true;
                break;
            }
        }
    }
    if (restart == true) {
        refreshTally();
    }
}

function getUserIndex(name, type) {
    if (type == 'index') {
        for (let i = 0; i < tallyScore.length; i++) {
            if (tallyScore[i][0] == name) {
                return (i);
            } else if (i == tallyScore.length - 1) {
            }
        }
    } else if (type == 'isIn') {
        for (let i = 0; i < tallyScore.length; i++) {
            if (name == tallyScore[i][0]) {
                return (true);
            } else if (i == tallyScore.length - 1) {
                return (false);
            }
        }
    }
}

function getServerId(id) {
    for (let i = 0; i < fullVars.length; i++) {
        if (fullVars[i][0][0][0] == id) {
            return (i);
        }
    }
}

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}
