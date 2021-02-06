const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.js')
const bot = new TelegramBot(config.token, {polling: true});

bot.onText(/\/request (.+)/, (msg) => {
  // General base: splited raw message with space
  var msgComparableRaw = msg.text.split(' ')

  // Some workarounds! (Ignore the 'derped' code)
  if (msgComparableRaw[1].match('(http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?')) {
    var trueToSend = true
  }
  
  // Way to avoid users who use topics to make a request, forcing it to be done within the group
  if (msg.from.id == "777000") {
    bot.deleteMessage(msg.chat.id, msg.message_id);
  } else {
    // Valid if is main group
    if (msg.chat.id == config.mainChat) {
      if (trueToSend == true) {
        // Delete order message
        bot.deleteMessage(msg.chat.id, msg.message_id);

        // Send thanks message
        bot.sendMessage(msg.chat.id, 'Hello [' + msg.from.first_name + '](tg://user?id=' + msg.from.id + ') (`' + msg.from.id + '`)' + ', your request has been sent! Just wait now.', {
          parse_mode: "markdown"
        });

        // Split firmware link
        var firmwareLink = msgComparableRaw[1]

        // Send order message to private group
        bot.sendMessage(config.privateChat,
          '\uD83D\uDCE9 ***New GSI order received!***\n\n'
          + "\uD83D\uDCE6 ***Firmware/ROM Link***\n"
          + '`' + firmwareLink + '`\n\n'

          + "❕ ***Additional information***\n"
          + '`This information is not available.`'
          + '\n\n'
          + "❔ ***User info***\n\n"
          + "***• First name:*** `" + validateUsernameOrName(msg.from.first_name) + "`\n"
          + "***• Last name:*** `" + validateUsernameOrName(msg.from.last_name) + "`\n"
          + "***• Username:*** `" + validateUsernameOrName(msg.from.username) + "`\n"
          + "***• User ID:*** `" + msg.from.id + "`\n"
          + "***• Language Code:*** `" + msg.from.language_code + "`\n", {
          disable_web_page_preview: true,
          parse_mode: "markdown"
        });
      } else {
        // Delete order message
        bot.deleteMessage(msg.chat.id, msg.message_id);

        // Send sad message lol
        bot.sendMessage(msg.chat.id, 'Hello [' + msg.from.first_name + '](tg://user?id=' + msg.from.id + ') (`' + msg.from.id + '`)' + ', the link you sent appears to be invalid! Use with http parameters and try again.', {
          parse_mode: "markdown"
        });
      }
    } else {
      bot.sendMessage(msg.chat.id, 'This bot cannot be used in other locations, use it in the [Velosh](https://t.me/veloshgsis) group!')
    }
  }
});

function validateUsernameOrName(str) {
  if (str == 'undefined') {
    return "Don't have"
  } else {
    return str
  }
}