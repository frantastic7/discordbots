require('dotenv').config();
const path = require('path');
const configpath = path.join(__dirname, '../../config.json');
const config = require(configpath);
const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
const fs = require('fs');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('draw')
    .setDescription('Get Dall-E to draw you a picture')
    .addStringOption(option => 
      option.setName('prompt')
        .setDescription('What you want Dall-E to draw')
        .setRequired(true)),
  async execute(interaction) {
    const prompt = interaction.options.getString('prompt');
    const image_name = prompt +".png"
    try {
      interaction.deferReply();

      let response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      });

      const imageURL = response.data.data[0].url;
      const imageResponse = await axios.get(imageURL, {
        responseType: 'arraybuffer'
      });
    
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      const imagePath = `./pictures/${image_name}`;
      fs.writeFileSync(imagePath, imageBuffer);    
      
      await interaction.editReply({
        files: [imagePath]
      });
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error('Error:', error.message);
      await interaction.editReply('An error occurred while processing your request.');
    }
  },
};