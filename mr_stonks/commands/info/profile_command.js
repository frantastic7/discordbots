const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const config = require('./config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get profile and market capitalization of a company')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('The symbol of the company to get the profile for')
                .setRequired(true)),
    async execute(interaction) {
        const symbol = interaction.options.getString('symbol');
        const apiKeyFMP = config.FMP_APIKey;

        try {
            const [profileResponse, quoteResponse] = await Promise.all([
                axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKeyFMP}`),
                axios.get(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKeyFMP}`)
            ]);

            const profile = profileResponse.data[0];
            const quote = quoteResponse.data[0];

            if (!profile || !quote) {
                await interaction.reply(`No data found for ${symbol}.`);
                return;
            }

            const replyMessage = `Profile for ${symbol}:\n` +
                `Company name: ${profile.companyName}\n` +
                `Current price: $${quote.price}\n` +
                `Industry: ${profile.industry}\n` +
                `Sector: ${profile.sector}\n` +
                `CEO: ${profile.ceo}\n` +
                `Market capitalization: ${profile.mktCap}\n` +
                `Description: ${profile.description}\n` +
                `Website: ${profile.website}`;

            await interaction.reply(replyMessage);
        } catch (error) {
            await interaction.reply('Failed to fetch the company profile. Please try again later.');
        }
    }
};
