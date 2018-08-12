const $discord = require('discord.js'),
	  {$exec} = require('child_process'),
	  $loki = require('lokijs'),
	  $fs = require('fs'),
	  $path = require('path'),
	  app = {};

// Initialize database
app.db = new $loki('storage.json');

// Initialize discord.js bot engine
app.bot = new $discord.Client();

// Load configuration
app.config = require('./config.json');
app.config.discord.prefixes || (app.config.discord.prefixes = []);

// App start timestamp
app.timestamp = +Date();

// Load all available submodules
app.modules = {};

$fs.readdir('modules', (err, files) => {
  files.forEach(file => {
  	app.modules[file] = require($path.resolve('modules',file));
  	console.log(`- loading module "${file}"`);
  	if(typeof app.modules[file] === 'function'){
  		 app.modules[file](app);
  		 console.log(`+ running module "${file}"`);
  	}
  });
})
app.bot.on('init', guilds => {
	app.bot.user.setStatus('invisible'); // make bot disappear from online users list
})

app.bot.on('ready', _ => {
	console.log(`UP for ${app.bot.guilds.size} rooms, ${app.bot.channels.size} channels with ${app.bot.users.size} users`);
	app.bot.emit('init',app.bot.guilds);
})

app.bot.on('guildCreate', guild => {
	console.log(`Invited & UP for room ${guild.name} #${guild.id}`);
	app.bot.emit('init',[guild])
})

app.bot.on("guildDelete", guild => {
	console.log(`Removed & DN for room ${guild.name} #${guild.id}`);
})

// Processing prefixed messages
app.bot.on('message', async message => {
	if(app.config.discord.prefixes) 
		for(var id in app.config.discord.prefixes)
			if(message.content.startsWith(app.config.discord.prefixes[id]))
				if( await app.bot.emit(`message:${app.config.discord.prefixes[id]}`,message) ) return;
})

// Connect to discord
app.bot.login(app.config.discord.token);