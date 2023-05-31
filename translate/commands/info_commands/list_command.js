const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('langlist')
        .setDescription('Lists all the languages available'),
    async execute(interaction) {
        fs.readFile('./langlist.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return;
            }
            try {
                const data = JSON.parse(jsonString);
                interaction.reply({ content: data[0] });
            } catch (err) {
                console.log('Error parsing JSON string:', err);
            }
        });
    },
};
