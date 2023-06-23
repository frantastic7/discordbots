const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const dictpath = path.join(__dirname, '../../eng_to_elv.json');
const dict = require(dictpath)


module.exports = {
    data: new SlashCommandBuilder()
        .setName('sinsen')
        .setDescription('Translates a sentence from English to Elvish (Sindarin)')
        .addStringOption(option =>
            option.setName('sentence')
                .setDescription('The sentence in English')
                .setRequired(true)),
    async execute(interaction) {
        try {

            let english = interaction.options.getString('sentence');
            let elvish = "";
            const eng_arr = english.split(" ");

            for (let i = 0; i < eng_arr.length; i++) {
                const word = eng_arr[i];
                const dictItem = dict.find(item => Object.keys(item)[0] === word);
                const translatedWord = dictItem ? Object.values(dictItem)[0] : word;
                elvish += translatedWord + " ";
            }

            if (elvish) {
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
