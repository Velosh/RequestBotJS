const TelegramBot = require('node-telegram-bot-api');
const token = 'TOKEN-BOT-HERE';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/request (.+)/, (msg, match) => {
  url = match[1];
  // Some workarounds! (Ignore the 'derped' code)
  if (url.includes('http')) {	
    var trueToSend = true
  }
  if (url.match('(http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?')) {
    if (!trueToSend == false) var trueToSend = true
  }
  
  // Way to avoid users who use topics to make a request, forcing it to be done within the group
  if (msg.from.id == "777000") {
    // Delete the message kthxbye
    bot.deleteMessage(msg.chat.id, msg.message_id);
  } else {
    // Change -YourPublicGroupID/-YourPrivateGroupID vars!
    // -YourPublicGroupID: This variable is the ID of the public group where the bot will work and accept requests
    // -YourPrivateGroupID: This variable is the ID of the private group where the bot will send the order for you
    if (msg.chat.id == '-YourPublicGroupID') {
      if (trueToSend == true) {
        bot.deleteMessage(msg.chat.id, msg.message_id);
        bot.sendMessage(msg.chat.id, 'Hello ' + msg.from.first_name + ' (' + msg.from.id + ')' +', your request has been sent! Just wait now.');
        bot.sendMessage('-YourPrivateGroupID', 'New order received!\n' + 'GSI Link: ' + url, {
          disable_web_page_preview: true
        });
        bot.sendMessage('-YourPrivateGroupID', '- User who request -\nFirst name: ' + msg.from.first_name + '\nLast name: ' + msg.from.last_name + '\nUsername: ' + msg.from.username + '\nIs bot: ' + msg.from.is_bot + '\nUser ID: ' + msg.from.id + '\nLanguage code: ' + msg.from.language_code)
      } else {
        bot.deleteMessage(msg.chat.id, msg.message_id);
        bot.sendMessage(msg.chat.id, 'Hello ' + msg.from.first_name + ' (' + msg.from.id + ')' +', the link you sent appears to be invalid! Use with http parameters and try again.')
      }
    } else {
      bot.sendMessage(msg.chat.id, 'This bot cannot be used in other locations!')
    }
  }
});
