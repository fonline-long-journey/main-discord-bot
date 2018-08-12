module.exports = app => {
	app.config.discord.prefixes['!'] = true;
	app.config.discord.help['!бан @usertag'] = "забанить упомянутого в сообщении пользователя";
	app.config.discord.help['!кик @usertag'] = "кикнуть упомянутого в сообщении пользователя";

	app.bot.on('message:!', async message	=>	{
		// Консольные команды
		let target = message.mentions.members.first();
		switch(message.content){
			case "!бан":
				if(!message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS"))
					return message.reply('Не в вашей компетенции такие запросы');
				if(!target)
					return message.reply('@упомяните того, кого хотите забанить...');
				if(!target.bannable)
					return message.reply('У меня недостаточно прав на совершение такого действия');
				await member.ban().catch(error => message.reply(`, не выходит: ${error}`));
				return message.reply('Готово');
			case "!кик":	
				if(!message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS"))
					return message.reply('Не в вашей компетенции такие запросы');
				if(!target)
					return message.reply('@упомяните того, кого хотите кикнуть...');
				if(!target.kickable)
					return message.reply(`У меня недостаточно прав на совершение такого действия над ${target.username}`);
				await member.kick().catch(error => message.reply(`, не выходит: ${error}`));
				return message.reply('Готово');
		}
		
	})
}