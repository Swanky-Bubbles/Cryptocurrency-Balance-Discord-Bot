require('dotenv').config() // Load .env file
const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS"]})


async function getBalance() {

        // API for Balance data.
        const serverIDs = client.guilds.cache.map(e => { return e.id; }).sort();
        let res = await axios.get(`${process.env.API_URL}api?module=account&action=tokenbalance&contractaddress=${process.env.TOKEN_ADDRESS}&address=${process.env.WALLET_ADDRESS}&tag=latest&apikey=${process.env.API_KEY}`);
                // If we got a valid response
                if(res.data.result ) {
                        let currentBalance = (res.data.result)*0.000000000000000001 || 0 // Default to zero

                        serverIDs.forEach(function (item, index){
                                client.user.setActivity(`${process.env.TOKEN_NAME.toUpperCase()} Reward Pool`, {type: 'WATCHING'})

                                client.guilds.cache.get(item).me.setNickname(`${(currentBalance).toLocaleString().replace(/,/g,process.env.THOUSAND_SEPARATOR)}`)
        
                                console.log('Updated balance to', currentBalance)
                        });
                        

                }
                else
                        console.log('Could not load player count data for', process.env.COIN_ID)

}


// Runs when client connects to Discord.
client.on('ready', async() => {
        console.log('Logged in as', client.user.tag)

        getBalance() // Ping server once on startup
        // Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
        setInterval(getBalance, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord
client.login(process.env.DISCORD_TOKEN)
