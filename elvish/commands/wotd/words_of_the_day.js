const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const dictpath = path.join(__dirname, '../../eng_to_elv.json');
const dict = require(dictpath)



module.exports = {
    data: new SlashCommandBuilder()
        .setName('wotd')
        .setDescription('Gives a random Sindarin word with English translation'),
    async execute(interaction) {
        try {
            const randomIndex = Math.floor(Math.random() * dict.length);
            const randomEntry = dict[randomIndex];
            const english = Object.keys(randomEntry)[0];
            const elvish = randomEntry[english];
            if (elvish) {
                await interaction.reply(`"${english}" (in English) is "${elvish}" (in Sindarin)`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to find word. Please try again later.');
        }
    },
};
