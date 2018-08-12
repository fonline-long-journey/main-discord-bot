const $util = require('util');
const $exec = require('await-exec');
const $net = require('net');

// @@todo убрать гребаную процедурщину, вынести проверку на ГМство в отдельную функцию

module.exports = app => {
    app.server || ( app.server = {} );
    app.config.discord.help['?статус'] = "показывает статус сервера (обрезанный ~gameinfo 1)";
    app.config.discord.help['?игроки <ГМ>'] = "сводка по текущим игрокам в игре";
    app.config.discord.help['?локации <ГМ>'] = "статистика локаций и карт";
    app.config.discord.help['?события <ГМ>'] = "текущие временные события";
    app.config.discord.help['?данные <ГМ>'] = "текущее состояние данных AnyData";
    app.config.discord.help['?предметы <ГМ>'] = "статистика предметов в игре";
    app.config.discord.help['?память <ГМ>'] = "статистика использования памяти";
    app.config.discord.help['?гресни ID <ГМ>'] = "убивает криттер в игре";
    app.config.discord.help['?убей ID <ГМ>'] = "возрождает криттер в игре";
    
    const askServer = function(message,rowsCount=0) {
      return new Promise((resolve, reject) => {
        var sock = new $net.Socket();
        sock.connect(app.config['fonline-admin'].port, app.config['fonline-admin'].host);
        var authorized = false;
        var response = '';
        sock.on('data',function(data){
            var data = `${data}`;
            if(data.includes('Enter access key')){
                sock.write(Buffer.from(app.config['fonline-admin'].password));
            }else if(data.includes('Authorized for')){
                authorized = true;
                sock.write(Buffer.from(message));
            }else{
                if(!authorized) return resolve("Не подходит пароль от админки :(\n\0");
                response += data.replace(/\n/g,"\r\n").replace(/\0/g,'');
            }
        });
        sock.on('error',function(data){
            resolve("Не могу подключится к серверу");
        })
        setTimeout(_=>{
            response = response.trim();
            if(rowsCount > 0) response = response.split("\n").slice(0,rowsCount).join("\n");
            resolve(response);
            sock.destroy();
        },1000);
      });
    }
    
	app.config.discord.prefixes['?'] = true;
	app.config.discord.help['?статус'] = "запрашивает статус сервера";
	
	var mEditOrAppend = (m,message,result) => {
	    if(result.length > 1950){
	        result = result.match(/(.|[\r\n]){1,1950}/g);
	        for(var pos = 0; pos < result.length; pos++){
	            if(!pos) m.edit(`\`\`\`${result[pos]}\`\`\``);
	            else message.channel.send(`\`\`\`...${result[pos]}\`\`\``);
	        }
	    }else m.edit(result);
	};
	
	// Команды с параметрами
	app.bot.on('message:?', async message => {
	    var args  = message.content.split(/\s/);
	    switch(args[0]){
	        case "?гресни":
	            if(message.member && !message.member.hasPermission("KICK_MEMBERS")) 
    	            return message.reply('для этого нужно быть модератором канала (:');
	            var m = await message.channel.send("Сейчас...");
	            if(!args[1] || !(+args[1] > 0)) return message.reply('Кого?...');
	            var result = (await askServer(`~respawn ${args[1]}`));
	            result = result.replace('Respawn success','готово');
                mEditOrAppend(m,message,result);
	            break;
	        case "?убей":
	            if(message.member && !message.member.hasPermission("KICK_MEMBERS")) 
    	            return message.reply('для этого нужно быть модератором канала (:');
	            var m = await message.channel.send("Сейчас...");
	            if(!args[1] || !(+args[1] > 0)) return message.reply('Кого?...');
	            var result = (await askServer(`~kill ${args[1]}`));
	            result = result.replace('Critter is dead','*вы слышите звон передергиваемого затвора, приглушенный глушителем выстрел*... Готово.');
                mEditOrAppend(m,message,result);
	            break;
	    }
	})
	
	// Команды без параметров
	app.bot.on('message:?', async message	=>	{
    	switch(message.content){
    	    case '?память':
    	        if(message.member && !message.member.hasPermission("KICK_MEMBERS")) 
    	            return message.reply('для этого нужно быть модератором канала (:');
    	        var m = await message.channel.send("Сейчас...");
                var result = (await askServer('~gameinfo 0'));
                mEditOrAppend(m,message,result);
                break;
    	    case '?предметы':
    	        if(message.member && !message.member.hasPermission("KICK_MEMBERS")) 
    	            return message.reply('для этого нужно быть модератором канала (:');
    	        var m = await message.channel.send("Сейчас...");
                var result = (await askServer('~gameinfo 5'));
                mEditOrAppend(m,message,result);
                break;
    	    case '?данные':
    	        if(message.member && !message.member.hasPermission("KICK_MEMBERS")) 
    	            return message.reply('для этого нужно быть модератором канала (:');
    	        var m = await message.channel.send("Сейчас...");
                var result = (await askServer('~gameinfo 4'));
                mEditOrAppend(m,message,result);
                break;
    	    case '?события':
    	        if(message.member && !message.member.hasPermission("KICK_MEMBERS")) 
    	            return message.reply('для этого нужно быть модератором канала (:');
    	        var m = await message.channel.send("Сейчас...");
                var result = (await askServer('~gameinfo 3'));
                mEditOrAppend(m,message,result);
                break;
    	    case '?локации':
    	        if(message.member && !message.member.hasPermission("KICK_MEMBERS")) 
    	            return message.reply('для этого нужно быть модератором канала (:');
    	        var m = await message.channel.send("Сейчас...");
                var result = (await askServer('~gameinfo 2'));
                mEditOrAppend(m,message,result);
                break;
    	    case '?статус':
    	        var m = await message.channel.send("Сейчас...");
    	        var result = (await askServer('~gameinfo 1',1));
    	        result = result.replace('Players in game','Игроков в игре');
    	        mEditOrAppend(m,message,result);
    	        break;
    	    case '?игроки':
    	        if(message.member && !message.member.hasPermission("KICK_MEMBERS")) 
    	            return message.reply('для этого нужно быть модератором канала (:');
    	        var m = await message.channel.send("Сейчас...");
    	        var result = (await askServer('~gameinfo 1'));
    	        result = result.replace('Players in game','Игроков в игре');
    	        result = result.replace('Connections','Подключений');
    	        result = result.replace('Name','Логин');
    	        result = result.replace('Online','Онлайн');
    	        result = result.replace('Cond','Состояние');
    	        result = result.replace('Location','Локация');
    	        result = result.replace('Map','Карта');
    	        result = result.replace('Level','Уровень');
    	        result = result.replace(/Yes/g,'Да');
    	        result = result.replace(/No/g,'Нет');
    	        result = result.replace(/Life/g,'Жив');
    	        result = result.replace(/Dead/g,'Жив');
    	        result = result.replace(/[\t ]+/g,' ');
    	        mEditOrAppend(m,message,result);
    	        break;
    	}
	})
}

