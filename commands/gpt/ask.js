/*
 * MIT License
 *
 * Copyright (c) 2022 Amine Zouaoui
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const {clearPrompt, runGPT} = require("../../handlers/gpt-handler.js");
const {ApplicationCommandOptionType} = require('discord.js');
const fs = require("fs");

const STRING = ApplicationCommandOptionType.String
require('dotenv').config();

const description = 'Speak to an awesome AI'
const options = [
    {
        name: 'message',
        description: 'Your message to the bot',
        required: true,
        type: STRING,
    },

]



const run = async (interaction, client) => {
    let config= JSON.parse(fs.readFileSync(require.resolve('../../config.json')));
    const guildID = interaction.guildId;
    const msg = interaction.options.getString('message');
    await interaction.deferReply();
    try {
        config[guildID].gpt.prompt = '';
        config[guildID].readMode = false;
        await fs.writeFileSync(require.resolve('../../config.json'), JSON.stringify(config, null, 4));
        const completion = await runGPT(guildID,msg);
        await interaction.editReply(completion);
    } catch (error) {
        await interaction.editReply("There was an error while speaking to ChatGPT. Please try again later.");
        await console.log(error);
    }


}

module.exports= {run, description, options}
