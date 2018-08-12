const $util = require('util');
const $exec = require('await-exec');

module.exports = app => {
	app.config.discord.prefixes['!'] = true;
	app.config.discord.help['!пинг'] = "проверить мой дискорд-пинг";
	app.config.discord.help['!озу'] = "вывод состояния ОЗУ сервера";
	app.config.discord.help['!память'] = "вывод состояния постоянной памяти сервера";
	app.config.discord.help['!помощь'] = "показать эту справку";

	app.bot.on('message:!', async message	=>	{
		// Консольные команды
		switch(message.content){
			case "!помощь":
				result = "\nОкей, доступные команды:";
				for(var command in app.config.discord.help){
					let row = `\n${command} - ${app.config.discord.help[command]}`;
					if( (message.length + row.length) >= 1800 ){
						 message.channel.send(result);
						 result = '';
					}else result += row;
				}
				message.channel.send(result);
				return true;
			case "!пинг":
				const m = await message.channel.send("Подсчитываю...");
    			m.edit(`Пинг API: ${Math.round(app.bot.ping)}мс. Задержка канала: ${m.createdTimestamp - message.createdTimestamp}мс.`);
    			return true;
			case "!озу": 
				var {stderr,stdout} = await $exec('free -m', { shell: false });
				break;
			case "!память":
				var {stderr,stdout} = await $exec("egrep 'Mem|Cache|Swap' /proc/meminfo", { shell: false });
				break;
		}
		if(stderr !== undefined && stderr) message.reply(`Не могу проверить: ${stderr}`);
		else if( stdout !== undefined ) message.reply(`\`\`\`Css\n${stdout}\n\`\`\``);
		if(stderr || stdout) return true;
	})
}