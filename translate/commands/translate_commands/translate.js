const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const languages = require ("./lang.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translates text between two languages')
        .addStringOption(option => 
            option.setName('from')
                .setDescription('The language the text is in')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('to')
                .setDescription('The language you want to translate the language to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Input text for translating')
                .setRequired(true)),
    async execute(interaction) {
        const LF = interaction.options.getString('from');
        const LT = interaction.options.getString('to');
        const text = interaction.options.getString('text');
        const languageFrom = LF.charAt(0).toUpperCase() + LF.slice(1).toLowerCase();
        const languageTo = LT.charAt(0).toUpperCase() + LT.slice(1).toLowerCase();

        const fromCode = Object.keys(languages).find(key => languages[key] === languageFrom);
        const toCode = Object.keys(languages).find(key => languages[key] === languageTo);
        
        if (!fromCode || !toCode) {
            await interaction.reply('Invalid language specified.');
            return;
        }

        try {
            const response = await axios.get(`https://api.mymemory.translated.net/get?q=${text}&langpair=${fromCode}|${toCode}`);
            const data = response.data;

            let translatedText = data.responseData.translatedText;
            data.matches.forEach(data => {
                if (data.id === 0) {
                    translatedText = data.translation;
                }
            });

            await interaction.reply(`"${text}" (in ${languageFrom}) is "${translatedText}" (in ${languageTo})`);

        } catch (error) {
            await interaction.reply('Failed to translate the text. Please try again later.');
        }
    }
};
