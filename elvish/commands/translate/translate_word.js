const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const dictpath = path.join(__dirname, '../../eng_to_elv.json');
const dict = require(dictpath)


module.exports = {
    data: new SlashCommandBuilder()
        .setName('sindarin')
        .setDescription('Translates a word from English to Elvish (Sindarin)')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word in English')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const english = interaction.options.getString('word');
            const translation = dict.find(item => Object.keys(item)[0] === english);

            if (translation) {
                const elvish = translation[english];
                await interaction.reply(`"${english}" (in English) is "${elvish}" (in Sindarin)`);
            } else {
                await interaction.reply(`No translation found for "${english}".`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to translate the text. Please try again later.');
        }
    },
};
