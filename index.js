// Load up the discord.js library
const Discord = require("discord.js");
const http = require('http');
const https = require('https');
const Embed = require('discord.js-embed');
const embed = new Embed();
const { exec } = require('child_process');
const loki = require('lokijs');
var db = new loki('db.json');

var badWords = [
  "блин",
  "нихуя",
  "нахер",
  "похуй",
  "бля ",
  " бля",
  "дебил",
  "фак",
  "сука",
  "шваль",
  "тварь",
  "фонлайн",
  "ебаши",
  "ебашь",
  " ебля",
  ];
var warnedUsers = {};

var channel = null;

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  //client.user.setActivity(`FOnline`);
  client.user.setStatus('invisible')
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setStatus('invisible')
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setStatus('invisible')
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  //message.reply('успокойся уже!');
  //return;
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
 // if(message.author.discriminator == 7879 && Math.random() < .1) message.delete(o_0=>{});
  
  // Обработка полных сообщений
  var fullMessage = message.content.toLowerCase();
  if(fullMessage == 'когда запуск?'){
    message.channel.sendMessage(`*смотрит на ${message.author} странным взглядом*`);
  }
  
  channel = message.channel;

  // BAD WORDS FILTER
 /* badWords.forEach(function(word){
    if(fullMessage.includes(word) ){
      warnedUsers[message.author.id] = warnedUsers[message.author.id] ? warnedUsers[message.author.id] + 1 : 1;
      switch(warnedUsers[message.author.id]){
        case 1: return message.reply(`[1/4] Слово "${word}" запрещено. Пожалуйста, не материтесь`);
        case 2: return message.reply(`[2/4] Убедительно прошу не матерится. "${word} - запрещено!"`);
        case 3: return message.reply(`[3/4] Последний раз повторяю. Матерится запрещено. "${word}", ага. *берет крупнокалиберную винтовку и направляет на человека*`);
        case 4: 
          let member = message.mentions.members.first();
          member.ban("За мат")
          .then(() => console.log("*вы слышите приглушенный выстрел*"))
          .catch(console.error);
      }
      
            //    await member.ban(reason).catch(error => message.reply("*глубоко вздохнув, опускает ствол и отворачивается*"));
          //message.reply(`*вы слышите приглушенный глушителем щелчок*`);
      return;
    }
  });*/
  
      
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if( command === 'статус' ){
    message.reply("https://fonline-status.ru/status.php?s=62.16.5.95&p=6112&.png");
  }
  
  if( command === 'цензурь' ){
    if(!args[0]) return message.reply(JSON.stringify(badWords));
    badWords.push(args[0]);
    return message.reply(`Окей, "${args[0]}" запрещено к употреблению`);
  }
  
  if(command == 'myinfo'){
    message.reply(`id: ${message.author.id}\ntag: ${message.author.tag}\nname: ${message.author.username}\ndsc: ${message.author.discriminator}`);
  }
  
  if(command === "пинг") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Сейчас...");
    m.edit(`Есть! Результат: ${m.createdTimestamp - message.createdTimestamp}мс. API-задержка ${Math.round(client.ping)}мс`);
  }
  
  if(command === 'hdd'){
    var pid = +args[0];
    exec("egrep 'Mem|Cache|Swap' /proc/meminfo", (err, stdout, stderr) => {
      if (err) {
        message.reply('Ошибка, не могу получить данные');
        return;
      }
      message.channel.send(`\`\`\`\n${stdout}\n\`\`\``);
    });
  }
  if(command === 'ram'){
    var pid = +args[0];
    exec("free -m", (err, stdout, stderr) => {
      if (err) {
        message.reply('Ошибка, не могу получить данные');
        return;
      }
      message.channel.send(`\`\`\`\n${stdout}\n\`\`\``);
    });
  }
  
  if(command === 'пид'){
    var pid = +args[0];
    exec('php parsePids.php', (err, stdout, stderr) => {
      if (err) {
        message.reply('Не знаю такого');
        return;
      }
      var result = JSON.parse(stdout);
      if(!pid) return message.channel.send('Уточните PID');
      if(!result[pid]) return message.channel.send('PID не существует');
      message.channel.send(`\`\`\`\n${result[pid].trim()}\n\`\`\``);
    });
  }
  
  if(command === 'крафт'){
    var pid = args[0];
    exec('php parseCraft.php', (err, stdout, stderr) => {
      if (err) {
        message.reply('Не знаю такого');
        return;
      }
      // the *entire* stdout and stderr (buffered)
      var result = JSON.parse(stdout);
      if(!pid) return message.channel.send('Уточните код предмета');
      if(result[pid])
      message.channel.send(`\`\`\`\n${result[pid].trim()}\n\`\`\``);
      else 
      message.channel.send('Не знаю такого');
      //message.channel.send(`${result[pid]}`);
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);
    });
  }
  
  if(command === "скажи") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  
  /*if(command === 'тест') {
    var voiceChannel = message.member.voiceChannel;
    voiceChannel.join().then(connection =>{
      //const dispatcher = connection.playFile('./audiofile.mp3');
    }).catch(err => console.log(err));
  }*/
  
  /*if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }*/
  
  if(command === "снесиВсе") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);