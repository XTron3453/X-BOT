const Discord = require('discord.js')
const bot = new Discord.Client()

const token = ""

const prefix = "-"

var savedChannels = {}
var potatoCount = {}
var points = {}
var items = {}
var visionary = {}
var antivirus = {}
var ransomware = {}
var ransomware_on = false
var nameDraw = []
var time = 0
var potatoOn = false
var potatoDate = null
var roundCounter = 0

bot.on('ready', () => {
	console.log("X-BOT online. Hello XTRON.")
});


function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function boom(){
	nameDraw.forEach(function(name) {
		console.log(name)
		var blownUp = savedChannels[name];
		if(potatoCount[name] === 1){
			console.log("Boom")
			blownUp.send("**BOOM! You have exploded.**")
			delete savedChannels[name]
			delete removeA(nameDraw, name)
			delete potatoCount[name]
			delete points[name]
			delete items[name]
		} 
		else{
			savedChannels[name].send("**A player has been eliminated, this round is over.**")
		}

	})
}

function addPoint(){
	nameDraw.forEach(function(name) {
		var pointReceiver = savedChannels[name];
		if(potatoCount[name] === 1 && visionary[name] === 0){
			points[name] = points[name] + 1
			setTimeout(addPoint, 1000)
		}
	})
}

function endAntivrus(name){
	if(antivirus[name === 1]){
		antivirus[name] = 0
		savedChannels[name].send("**Your antivirus has expired. You are no longer protected.**")
	}
}

function clear(){
	clearTimeouts.forEach(function(id) {
		clearTimeout(id)
	})
}


bot.on('message', msg =>{

	let args = msg.content.substring(prefix.length).split(" ")

	switch(args[0]){
		case "test":
			msg.channel.send("Your test is successful.")
		break;
		case "addPotChannel": 
			const server = bot.guilds.cache.find(server => server.name === "X-ORG: TRON")
			const channel = server.channels.cache.find(channel => channel.name === args[2])

			savedChannels[args[1]] = channel
			potatoCount[args[1]] = 0
			items[args[1]] = []
			points[args[1]] = 0
			visionary[args[1]] = 0
			antivirus[args[1]] = 0

			nameDraw.push(args[1])
			msg.channel.send("Added")
			break;

		case "addDeleteChannel":
		//Need to implement
			msg.channel.send("Deleted")
			break;

		case "begin_potato":
			if(nameDraw.length >= 2){
				potatoOn = true

				var firstPot = nameDraw[Math.floor(Math.random() * nameDraw.length)]

				clear()
				clearTimeouts.splice(0, clearTimeouts.length)

				nameDraw.forEach(function(name) {
					if(visionary[name] === 1){
						savedChannels[name].send("**Visionary penalty has ended. You will now earn points again.**")
						visionary[name] = 0
					}
					if(antivirus[name] === 1){
						savedChannels[name].send("**Your antivirus has expired. You are no longer protected.**")
						antivirus[name] = 0
					}
					if(potatoCount[name] === 1) {potatoCount[name] = 0}
					savedChannels[name].send("**The next round has begun.**")
				})

				potatoCount[firstPot] = 1
				savedChannels[firstPot].send("**You have received the virus.**")
				time = [Math.floor(Math.random() * 21600000) + 60000] 
				time = getRndInteger(60000, 21600000)
				//console.log("Time: " + time)
				potatoDate = new Date()
				if(args[1] === "test"){time = 60000}
				setTimeout(boom, time)



				setTimeout(addPoint, 1000)
				msg.channel.send("Virus created and distributed.")

			} else {
				msg.channel.send("Cannot start game: there are not enough channels added.")
			}
			break;


		case "pass":
			if(potatoOn && nameDraw.includes(msg.author.username)){
				var sender = msg.author.username
				var receiver = nameDraw[Math.floor(Math.random() * nameDraw.length)]
				var antiCheck = [] 
				nameDraw.forEach(function(name) {
					if(name !== sender){
						antiCheck.push(antivirus[name])
					}
				})


				if(!(antiCheck.includes(0))){
					console.log("IN")
					msg.channel.send("Cannot pass: **all players currently have antiviruses online**")
				}
				else{
					while(receiver === sender || antivirus[receiver] === 1){
						receiver = nameDraw[Math.floor(Math.random() * nameDraw.length)]
					}

					potatoCount[sender] = 0
					potatoCount[receiver] = 1
					savedChannels[receiver].send("**You have received the virus.**")
				}
			}
			else{
				break
			}
			break

		case "bump":
			msg.channel.send("!d bump")
			break

		case "store":
			if(potatoOn && nameDraw.includes(msg.author.username)){
				msg.channel.send("**------------------------STORE------------------------**"
					+ 			 "\n   **To buy an item, do -buy {number} to buy an item**   " 
					+ 			 "\n	   **For more info on the item, do -info {number}**    " 
					+ 			 "\n                 1. -targetedAttack : 300 points           " 
					+ 			 "\n                    2. -visionary : 3600 points             " 
					+ 			 "\n                    3. -antivirus : 3600 points             " 
					+ 			 "\n                    4. -incognito : 7200 points             " 
					+ 			 "\n                 5. -ransomware :  7200 points             "
					+ 			 "\n                    6. -lockdown  : 9000 points             "
					+            "\n            7. -reducedTimeAttack : 12000 points        ")
				
			}
			else{
				break
			}
			break

		case "targetedAttack":
			if(potatoOn && nameDraw.includes(msg.author.username)){
				if(items[msg.author.username].includes(1)){
					function findItem(item){
						return item === 1
					}

					var index = items[msg.author.username].findIndex(findItem)

					var sender = msg.author.username
					var receiver = args[1]
					console.log(receiver)
					if(sender === receiver){
						msg.channel.send("You cannot target yourself...")
					} else if(!nameDraw.includes[receiver]){
						msg.channel.send("Recipient not found, try again.")
					} else if(antivirus[receiver] === 1){
						msg.channel.send("Cannot target: the receiver has an antivirus active.")
					}
					else{
						potatoCount[sender] = 0
						potatoCount[receiver] = 1
						delete items[msg.author.username][index]
						savedChannels[receiver].send("**You have received the virus.**")
					}				
				} 
				else{
					msg.channel.send("You do not currently own this hack. Do \"-store\" to see hack prices and \"-inventory\" to see what hacks you own now.")
				}
			}
			break

		case "visionary":
			if(potatoOn && nameDraw.includes(msg.author.username)){
				if(items[msg.author.username].includes(2)){
					function findItem(item){
						return item === 2
					}


					if(visionary[msg.author.username] === 0){

						var index = items[msg.author.username].findIndex(findItem)
						delete items[msg.author.username][index]

						visionary[msg.author.username] = 1

						var currentTime = new Date()
						var timeElapsed = currentTime.getTime() - potatoDate.getTime()
						var timeLeft = (time - timeElapsed) / 3600000

						msg.channel.send("The virus will explode in approximately " + timeLeft + " hours. Point earning has been disabled." )
					}
					else{
						msg.channel.send("You may not use visionary twice in one round." )
					}
				} 
				else{
					msg.channel.send("You do not currently own this hack. Do \"-store\" to see hack prices and \"-inventory\" to see what hacks you own now.")
				}
			}
			break

		case "antivirus":
			if(potatoOn && nameDraw.includes(msg.author.username)){
				if(items[msg.author.username].includes(3)){
					function findItem(item){
						return item === 3
					}

					var index = items[msg.author.username].findIndex(findItem)
					delete items[msg.author.username][index]

					antivirus[msg.author.username] = 1

					clearTimeouts.push(setTimeout(function() {endAntivrus(msg.author.username)}, 3600000))
					msg.channel.send("**You are protected. You will not receive the virus for one hour.**")

				} 
				else{
					msg.channel.send("You do not currently own this hack. Do \"-store\" to see hack prices and \"-inventory\" to see what hacks you own now.")
				}
			}
			break

		case "ransomware":
			if(potatoOn && nameDraw.includes(msg.author.username)){
				if(items[msg.author.username].includes(4)){
					function findItem(item){
						return item === 4
					}

					

				} 
				else{
					msg.channel.send("You do not currently own this hack. Do \"-store\" to see hack prices and \"-inventory\" to see what hacks you own now.")
				}
			}
			break


		case "info":
			if(potatoOn && nameDraw.includes(msg.author.username)){
				switch(args[1]){
					case "1":
						msg.channel.send("targetedAttack : pass the virus directly to another player of choice. The command is \"-targetedAttack {player}\". This power will be played in place of a -pass.")
					break
					case "2":
						msg.channel.send("visionary : see how much time the virus has before it explodes. However, you will be unable to earn points once this power is used. You will be able to recieve point at the beginning of the next round. You can only use this power once per round.")
					break
					case "3":
						msg.channel.send("antivirus : for one hour, you will have total virus immunity. The virus cannot be passed to you via any means for that one hour.")
					break
					case "4":
						msg.channel.send("incognito : the virus is passed to another player and will be undetectable for 10 minutes. The player may choose to pass the virus should they believe they currently have it. This power will be played in place of a -pass.")
					break
					case "5":
						msg.channel.send("ransomware: the next player to recieve the virus must pay half the price of the ransomware to pass the virus. This power will be played in place of a -pass.")
					break
					case "6":
						msg.channel.send("lockdown: players must solve a puzzle and get a password in order to pass virus for the next hour of play, except yourself. This power is not a substitute for a -pass.")
					break
					case "7":
						msg.channel.send("reducedTimeAttack: This will reduce the time left until the virus explodes dramatically. All players will be notified if this power is played. This power is not a substitute for a -pass.")
					break
					default:
						msg.channel.send("Please provide a number for more info. -info {number}.")
					break
				}
			}
			break

		case "buy":
			if(potatoOn && nameDraw.includes(msg.author.username)){
				switch(args[1]){
					case "1":
						if(points[msg.author.username] >= 300){
							points[msg.author.username] = points[msg.author.username] - 300
							items[msg.author.username].push(1)
							msg.channel.send("You have purchaed a targetedAttack. See all your hacks with \"-inventory\"")
						} else{
							msg.channel.send("You do not have enough points to buy this hack. Do \"-wallet\" to see your current point total.")
						}
					break
					case "2":
						if(points[msg.author.username] >= 1){
							points[msg.author.username] = points[msg.author.username] - 1
							items[msg.author.username].push(2)
							msg.channel.send("You have purchaed a visionary. See all your hacks with \"-inventory\"")
						} else{
							msg.channel.send("You do not have enough points to buy this hack. Do \"-wallet\" to see your current point total.")
						}
					break
					case "3":
						if(points[msg.author.username] >= 1){
							points[msg.author.username] = points[msg.author.username] - 1
							items[msg.author.username].push(3)
							msg.channel.send("You have purchaed a antivirus. See all your hacks with \"-inventory\"")
						} else{
							msg.channel.send("You do not have enough points to buy this hack. Do \"-wallet\" to see your current point total.")
						}
					break
					case "4":
						if(points[msg.author.username] >= 7200){
							points[msg.author.username] = points[msg.author.username] - 7200
							items[msg.author.username].push(4)
							msg.channel.send("You have purchaed a incognito. See all your hacks with \"-inventory\"")
						} else{
							msg.channel.send("You do not have enough points to buy this hack. Do \"-wallet\" to see your current point total.")
						}
					break
					case "5":
						if(points[msg.author.username] >= 7200){
							points[msg.author.username] = points[msg.author.usernamer] - 7200
							items[msg.author.username].push(5)
							msg.channel.send("You have purchaed a ransomware. See all your hacks with \"-inventory\"")
						} else{
							msg.channel.send("You do not have enough points to buy this hack. Do \"-wallet\" to see your current point total.")
						}
					break
					case "6":
						if(points[msg.author.username] >= 9000){
							points[msg.author.username] = points[msg.author.username] - 9000
							items[msg.author.username].push(6)
							msg.channel.send("You have purchaed a lockdown. See all your hacks with \"-inventory\"")
						} else{
							msg.channel.send("You do not have enough points to buy this hack. Do \"-wallet\" to see your current point total.")
						}
					break
					case "7":
						if(points[msg.author.username] >= 12000){
							points[msg.author.username] = points[msg.author.username] - 12000
							items[msg.author.username].push(7)
							msg.channel.send("You have purchaed a reducedTimeAttack. See all your hacks with \"-inventory\"")
						} else{
							msg.channel.send("You do not have enough points to buy this hack. Do \"-wallet\" to see your current point total.")
						}
					break
					default:
						
					break
				}
			}
			break

		case "inventory":
			msg.channel.send("Inventory (hacks are in number form): " + items[msg.author.username])
			break

		case "wallet":
			msg.channel.send("Total Points Accumulated: " + points[msg.author.username])
			break
	}

	
});




bot.login(token);
