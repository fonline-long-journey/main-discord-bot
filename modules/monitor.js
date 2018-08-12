const $util = require('util');
const $exec = require('await-exec');

module.exports = app => {
	app.config.discord.prefixes.push('!');

	app.bot.on('message:!', async message	=>	{
		// Консольные команды
		switch(message.content){
			case "!пинг":
				const m = await message.channel.send("Подсчитываю...");
    			m.edit(`Пинг API: ${Math.round(app.bot.ping)}мс. Задержка: ${m.createdTimestamp - message.createdTimestamp}мс.`);
    			return true;
			case "!озу": 
				var {stderr,stdout} = await $exec('free -m', { shell: true });
				break;
			case "!память":
				var {stderr,stdout} = await $exec("egrep 'Mem|Cache|Swap' /proc/meminfo", { shell: true });
				break;
		}
		if(stderr !== undefined && stderr) message.reply(`Не могу проверить: ${stderr}`);
		else if( stdout !== undefined ) message.reply(`\`\`\`Css\n${stdout}\n\`\`\``);
		if(stderr || stdout) return true;
	})
}