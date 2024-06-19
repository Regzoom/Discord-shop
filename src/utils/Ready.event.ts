import { ActionRowBuilder, AttachmentBuilder, ButtonStyle, Client, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";
import * as config from "../config"

export default class Ready {
    async run(client: Client) {
        const guild = client.guilds.cache.get(config.guild)
        const channel = guild!.channels.cache.get(config.channel) as TextChannel;
        const file = new AttachmentBuilder(`${__dirname}/../../assets/img/start_photo.png`)

        if (!channel || !guild) return;

        const select = new StringSelectMenuBuilder()
            .setCustomId("product_select")
            .setPlaceholder("Что вы хотите купить?")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Разработка")
                    .setValue("developer")
                    .setEmoji(config.emojis.developer)
                    .setDescription("Купить разработку ботов/сайтов/приложений в Kazami DEV"),

                new StringSelectMenuOptionBuilder()
                    .setLabel("Дизайн")
                    .setValue("design")
                    .setEmoji(config.emojis.designer)
                    .setDescription("Купить дизайн услуги в Kazami Design"),
                
                new StringSelectMenuOptionBuilder()
                    .setLabel("Нитро")
                    .setValue("nitro")
                    .setEmoji(config.emojis.nitro)
                    .setDescription("Купить дискорд нитро Kazami Shop"),

                new StringSelectMenuOptionBuilder()
                    .setLabel("Обучение стаффу")
                    .setValue("staff")
                    .setEmoji(config.emojis.education)
                    .setDescription("Купить услуги обучения стаффа Kazami Staff"),

                new StringSelectMenuOptionBuilder()
                    .setLabel("Тех. поддержка")
                    .setValue("help")
                    .setEmoji(config.emojis.support)
                    .setDescription("Связаться с технической поддержкой Kazami"),

                new StringSelectMenuOptionBuilder()
                    .setLabel("Получить приз")
                    .setValue("get_prise")
                    .setEmoji(config.emojis.nitrogift)
                    .setDescription("Вы выиграли в конкурсе и хотите получить свой приз? Тогда вам сюда!")
                    
            )
        
        const as = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)

        return channel.send({
            
                "content": "",
                "tts": false,
                "embeds": [
                  {
                    "color": 10535045,
                    "image": {
                      "url": "https://media.discordapp.net/attachments/1114971809629089913/1247504826338775093/d16e80bbac7f5453.png?ex=666044e8&is=665ef368&hm=b4a6126278f7bc0e34e8af8b95e14abd6121c98174aa797417f4f48b60e46376&=&format=webp&quality=lossless&width=1439&height=596"
                    },
                    "fields": []
                  },
                  {
                    "color": 10535045,
                    "image": {
                      "url": "https://media.discordapp.net/attachments/1114971809629089913/1247504823864135710/3e913fc63837e603.png?ex=666044e7&is=665ef367&hm=a815ce3309ab50e52ea58cd3b79c29a718b11ac1a96ed9b239acc939af19d1ad&=&format=webp&quality=lossless&width=1439&height=596"
                    },
                    "fields": [],
                    "description": "Нужна помощь с заказом товаров или услуг? Просто отправьте запрос через нашего бота <@1209541152102158337>!"
                  },
                  {
                    "title": "**Nitro Full GIFT**",
                    "color": 10535045,
                    "image": {
                      "url": "https://media.discordapp.net/attachments/1114971809629089913/1247504821960048670/Nitro_full_gift.png?ex=666044e7&is=665ef367&hm=b1be1847a966d16ab64d0f3686103b047be9461fcb7016a152f8afad259f96af&=&format=webp&quality=lossless&width=1439&height=596"
                    },
                    "fields": [
                      {
                        "name": "💵 Стоимость | 📅 1 месяц  :",
                        "value": "``` 500₽/230₴/2564₸/6$ ```",
                        "inline": true
                      },
                      {
                        "name": "💵 Стоимость | 📅 1 год  :",
                        "value": "``` 3999₽/1659₴/19499₸/43$ ```",
                        "inline": true
                      }
                    ]
                  },
                  {
                    "title": "**Nitro Basic GIFT**",
                    "color": 10535045,
                    "image": {
                      "url": "https://media.discordapp.net/attachments/1114971809629089913/1247504816041758731/Nitro_basic_gift.png?ex=666044e5&is=665ef365&hm=235ba03bd096a91f1863a4a8d68af233ffd4e254506155934f29b34e3e03c92c&=&format=webp&quality=lossless&width=1439&height=596"
                    },
                    "fields": [
                      {
                        "name": "💵 Стоимость | 📅 1 месяц  :",
                        "value": "``` 249₽/99₴/1249₸/3$```",
                        "inline": true
                      },
                      {
                        "name": "💵 Стоимость | 📅 1 год  :",
                        "value": "``` 1999₽/829₴/9899₸/22$```",
                        "inline": true
                      }
                    ]
                  }
                ],
                "components": [as],
            });
    };
};