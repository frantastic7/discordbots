require('dotenv').config();
const config = require('./config.json');
const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');

info = "You are an analyst at the top invenstment firm in New York. You are about to be given a balance sheet for a company and are required to provide an analysis and wether the comapny should be bought or sold. The current price will also be provided. All cash values provided are in USD ($). After your analysis give the verdict, should the client buy or sell the stock. Be sure to keep the analysis short enough to still have enough tokens to give your verdict, the tokens provided are 200."

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Get Mr. Stonks to evaluate a company (NOT FINANCIAL ADVICE)')
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('The symbol of the company to get evaluated')
                .setRequired(true)),
    async execute(interaction) {

        const symbol = interaction.options.getString('symbol').toUpperCase();
        const apiKeyFMP = config.FMP_APIKey;
        const apiKeyAV = config.StonkAPI;


        try {
            interaction.deferReply();
        
        

        const bal_sheet = await axios.get(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?limit=120&apikey=${apiKeyFMP}`);
        const balanceSheet = bal_sheet.data[0];

        price = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKeyAV}`);

        price_data = price.data;

            const response = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: info + "\n" + JSON.stringify(balanceSheet) + "\n" + JSON.stringify(price_data),
              temperature: 0.5,
              max_tokens: 200,
              top_p: 1.0,
              frequency_penalty: 0.5,
              presence_penalty: 0.0,
              stop: ["You:"],
            });
            const completion = response.data.choices[0].text.trim();
            await interaction.editReply(completion);
          } catch (error) {
            console.error('Error:', error.message);
            await interaction.editReply('An error occurred while processing your request.');
          }
        },
      };
      