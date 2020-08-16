const { Telegraf } = require('telegraf')
const request = require('request')
const express = require('express')

const app = express()
app.get("/",(req,res)=>{
    res.send("working")
})

app.listen(process.env.PORT || 3000)

const bot = new Telegraf(BOT_TOKEN)

var defaultSite = '1337x'
var defaultLimit = 5

bot.command('search',(ctx) =>{
    var searchQuery = ctx.message.text.slice(8)
    var url =  API_URL + "getTorrents?search_key=" + searchQuery +"&site=" + defaultSite
    request({url: url,json: true}, (error,response)=>{
        torrentData = response.body.torrents
        for(i=0; i<defaultLimit; i++){
            msg = String(torrentData[i]["name"]) + "\n Size: " + String(torrentData[i]["size"]) + "\n Seeders: " + String(torrentData[i]["seeds"]) + ", Leechers: "  + String(torrentData[i]["leeches"]) + "\n Link:\n" + String(torrentData[i]["link"])
            ctx.reply(msg)
        }
    })
})

bot.command('limit',(ctx) => {
    var curStatus = "Currently set Limit is " + String(defaultLimit) + "\nTo change it use /limit 'x' command where x is an integer"
    ctx.reply(curStatus)
    var searchQuery = ctx.message.text.slice(7)
    if(searchQuery){
        defaultLimit = parseInt(searchQuery)
        var msg = String(defaultLimit) + " is now default Limit."
        ctx.reply(msg)
    }
})

bot.command('site',(ctx) => {
    var curStatus = "Currently set site is " + defaultSite +"\nTo change it use /site 'xyz' command wher xyz is a the name of supported sites.\nTo fetch supported sites use /sites command."
    ctx.reply(curStatus)
    var searchQuery = ctx.message.text.slice(6)
    if(searchQuery){
        var str1 = "pirate";
        if(searchQuery.includes(str1)){
            defaultSite = "ThePirateBay"
        }else{
            defaultSite = "Rarbg"
        }
        ctx.reply(defaultSite + "working is now default search site")
    }

})

bot.command('sites',(ctx) => {
    var url = API_URL + 'getSites'
    request({url: url,json: true}, (error,response)=>{
        var siteArray = response.body.sites
        var siteStr = siteArray.join(', ')
        msg = "Supported Sites:\n" + siteStr + ". By Dafault it is set to 1337x. \n To change it use /site command eg:\n /site Rarbg"
        ctx.reply(msg)
    })
})


bot.start((ctx) => ctx.reply("Hi There!\nUse /search command to fetch results\n eg: /search infinity war.\n /help to learn about additional commands"))

bot.command('help', (ctx)=>{
    ctx.reply("Use /search command to fetch results\n eg: /search infinity war\n /limit command to change limit, By default its 5. \n eg: /limit 10 .\n /site to change the torrent site by default its 1337x\n eg: /site thepiratesbay.\n use /sites to fetch supported sites")
})

bot.launch()

