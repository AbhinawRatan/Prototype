# 3 am project

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Setup](#setup)
4. [Usage](#usage)
5. [Commands](#commands)
6. [Manual Mode](#manual-mode)
7. [Auto Mode](#auto-mode)
8. [Dependencies](#dependencies)
9. [License](#license)
10. [Future Scope](#future-scope)

## Overview

The Crypto Analysis Bot is a Telegram bot designed to provide users with real-time cryptocurrency price analysis. The bot uses multiple sources to fetch current prices and generates analysis based on the user's target price.

## Features
* Real-time cryptocurrency price analysis
* Support for multiple sources
* Manual mode for users to enter token symbol and target price
* Automatic analysis generation
* Auto mode for automated price tracking and analysis

## Setup

1. Clone the repository: `git clone https://github.com/your-username/crypto-analysis-bot.git`
2. Install dependencies: `npm install`
3. Set environment variables: `BOT_TOKEN`, `OPENAI_API_KEY`, and `PORT`
4. Start the bot: `npm start`

## Usage

1. Start the bot by sending the `/start` command
2. Use the `/manual` command to enter manual mode
3. Enter the token symbol and target price (e.g., BTC 30000)
4. Use the `/auto` command to enable auto mode

## Commands

* `/start`: Start the bot
* `/manual`: Enter manual mode
* `/auto`: Enable auto mode
* `/help`: Show help message

## Manual Mode

In manual mode, users can enter the token symbol and target price to receive analysis. The bot will fetch the current price from multiple sources and generate analysis based on the user's target price.

## Auto Mode

In auto mode, the bot will automatically track the prices of the top 10 cryptocurrencies and generate analysis based on the user's target price. The bot will send notifications to the user when the price reaches the target price.

## Dependencies

* `@dqbd/tiktoken`
* `@pinecone-database/pinecone`
* `axios`
* `dotenv`
* `express`
* `langchain`
* `mongoose`
* `openai`
* `telegraf`
* `winston`

## License

ISC License

## Future Scope

* Integrate with more cryptocurrency exchanges for real-time price updates
* Implement machine learning models for more accurate price predictions
* Add support for multiple languages
* Develop a web interface for users to access the bot's features
* Integrate with popular cryptocurrency wallets for seamless transactions
* Expand the bot's capabilities to include other financial instruments, such as stocks and forex
* Improve auto mode to track prices of more cryptocurrencies and send notifications to users





