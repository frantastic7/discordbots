const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const path = require('path');
const configpath = path.join(__dirname, '../../config.json');
const config = require(configpath)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Get the most recent annual balance sheet for a company')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('The symbol of the company to get the balance sheet for')
                .setRequired(true)),
    async execute(interaction) {
        const symbol = interaction.options.getString('symbol');
        const apiKeyFMP = config.FMP_APIKey;

        try {
            const response = await axios.get(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?limit=120&apikey=${apiKeyFMP}`);
            const balanceSheet = response.data[0];
            
            let replyMessage = `Most recent annual balance sheet for ${symbol}:\n`;
            Object.keys(balanceSheet).forEach(key => {
                const value = balanceSheet[key];
                replyMessage += `${key}: ${value}\n`;
            });

            await interaction.reply(replyMessage);
        } catch (error) {
            await interaction.reply('Failed to fetch the balance sheet. Please try again later.');
        }
    }
};
