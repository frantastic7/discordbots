# Discord bots repo


Various discord bots I've made.  
1. Mr.Stonks - stock bot (prices, earning, company profiles for over 40000 stocks) + AI powered evaluations
2. Translate bot - language translate bot with over 90+ languages to chose from
3. Elanorion - Elvish (Sindarin) teaching bot
4. Dall-E-bot - simple ai art gen bot using openai's dall-e api  
 
# Enviorment variables and API keys
You will need an OpenAI api key for all the bots. FMP and AV only for Mr. Stonks. Please add a .env file like such : 

```env
OPENAI_API_KEY=your_openai_api_key
FMP_API_KEY=your_fmp_api_key
ALPHA_VANTAGE_API_KEY=your_av_api_key
```  

# Config files
Config files for your bot, please make a "config.json" like such : 
```json
{
    "token":"discord_bot_token",
    "clientId":"discord_bot_id",
    "guildId":"server_id"
}
```
