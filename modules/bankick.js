/*module.exports =*/ app => {
	app.config.discord.prefixes['!'] = true;
	app.config.discord.help['!бан @usertag'] = "забанить упомянутого в сообщении пользователя";
	app.config.discord.help['!кик @usertag'] = "кикнуть упомянутого в сообщении пользователя";

	app.bot.on('message:!', async message	=>	{
		// Консольные команды
		var input = message.content.split(/\s/);
		command = input.reverse().pop();
		let target = false;
		target = message.mentions && message.mentions.members ? message.mentions.members.first() : null;
		/*if(!target && message.guild && message.guild.members){
			target = message.guild.members.get(input.pop());
		}*/
		switch(command){
			case "!бан":
				if(!message.member)
					return message.reply('Боюсь в этом канале это не возможно');
				if(!message.member.hasPermission("BAN_MEMBERS"))
					return message.reply('Не в вашей компетенции такие запросы');
				if(!target)
					return message.reply('@упомяните того, кого хотите забанить...');
				if(!target.bannable)
					return message.reply('У меня недостаточно прав на совершение такого действия');
				await member.ban().catch(error => message.reply(`, не выходит: ${error}`));
				return message.reply('Готово');
			case "!кик":	
				if(!message.member)
					return message.reply('Боюсь в этом канале это не возможно');
				if(!message.member.hasPermission("KICK_MEMBERS"))
					return message.reply('Не в вашей компетенции такие запросы');
				if(!target.user)
					return message.reply('@упомяните того, кого хотите кикнуть...');
				if(!target.user.kickable)
					return message.reply(`У меня недостаточно прав на совершение такого действия над ${JSON.stringify(target.user.username)}`);
				await member.kick().catch(error => message.reply(`, не выходит: ${error}`));
				return message.reply('Готово');
		}
		
	})
}