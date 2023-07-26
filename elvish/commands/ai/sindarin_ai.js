require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const dictpath = path.join(__dirname, '../../eng_to_elv.json');
const dict = require(dictpath);


const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let preprompt = `You are Elanorion, a wise Elf scholar, who spends her life learning all the languages of men. You possess immense knowledge of the elvish language Sindarin and the human language of English. Today your task is to help a human. He has an old Sindarin dictionary where he can find translations for some words, but he needs your help to form sentences. He will provide you a sentence in English, alongside all the translation pairs he could find. It is up to you to use your knowledge of Sindarin grammar to help the human translate the sentence in its entirety, as truthfully to the original as possible.

The human will give information as such:
"Example sentence"
word pairs e.g., "friend":"mellon"

You will respond with the translation of the original text in Sindarin.`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('atranslation')
    .setDescription('Translates a sentence from English to Elvish (Sindarin) (AI)')
    .addStringOption(option =>
      option.setName('sentence')
        .setDescription('The sentence in English')
        .setRequired(true)),
  async execute(interaction) {
    try {
      const user_input = interaction.options.getString('sentence');
      let translation_pairs = '';

      const eng_arr = user_input.split(' ');
      for (let i = 0; i < eng_arr.length; i++) {
        const word = eng_arr[i];
        const dictItem = dict.find(item => Object.keys(item)[0] === word);
        const translatedWord = dictItem ? Object.values(dictItem)[0] : word;
        
        translation_pairs += word + ':' + translatedWord + '\n';
      }

      const response = await openai.createChatCompletion({
        model: "gpt-4-0613",
        messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": preprompt},
            {"role": "user", "content": user_input},
            {"role": "user", "content": translation_pairs},
        ],
        temperature: 0.7,
        max_tokens: 512,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
    });
    
    const completion = response.data.choices[0].message['content'].trim();
    
      await interaction.reply(completion);
    } catch (error) {
      console.error('Error:', error.message);
      await interaction.reply('An error occurred while processing your request.');
    }
  },
};
