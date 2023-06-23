const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const path = require('path');
const configpath = path.join(__dirname, '../../config.json');
const config = require(configpath)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('income')
        .setDescription('Get the most recent income statment for a company')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('The symbol of the company to get the income statment for')
                .setRequired(true)),
    async execute(interaction) {
        const symbol = interaction.options.getString('symbol');
        const apiKeyFMP = config.FMP_APIKey;

        try {
            const response = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=120&apikey=${apiKeyFMP}`);
            const income = response.data[0];
            
            let replyMessage = `Most recent income statment sheet for ${symbol}:\n`;
            Object.keys(income).forEach(key => {
                const value = income[key];
                replyMessage += `${key}: ${value}\n`;
            });

            await interaction.reply(replyMessage);
        } catch (error) {
            await interaction.reply('Failed to fetch the income statment. Please try again later.');
        }
    }
};
