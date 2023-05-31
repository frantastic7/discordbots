const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const config = require('./config.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('price')
        .setDescription('Get the current stock price and daily change')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('The symbol of the stock to get the price for')
                .setRequired(true)),
    async execute(interaction) {
        const symbol = interaction.options.getString('symbol');
        const apiKey = config.StonkAPI;
        symbolC = symbol.toUpperCase()
        let response;
        try {
            response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
        } catch (error) {
            await interaction.reply('Failed to fetch the stock data. Please try again later.');
            return;
        }

        const data = response.data;
        if (data['Error Message']) {
            await interaction.reply('Error fetching stock data: ' + data['Error Message']);
            return;
        }

        const quote = data['Global Quote'];
        const price = parseFloat(quote['05. price']);
        const open = parseFloat(quote['02. open']);
        var changePercent = Math.abs((((open-price)/open)*100).toFixed(2))

        let imageUrl;
        if (price > open) {
            imageUrl = './attachments/is_up.png';

        }else{
            imageUrl = './attachments/is_down.jpeg';
            changePercent = - changePercent
        }
    

        const attachment = new AttachmentBuilder(imageUrl);
        await interaction.reply({ 
            content: `(${symbolC})\nCurrent price: $${price}\nOpened at: $${open}\nDaily change: ${changePercent}%`, 
            files: [attachment] 
        });
    },
};
