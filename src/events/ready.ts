import { type Client } from "discord.js";
import { BotEvent, IProducts } from "../types";
import { color } from "../functions";
import * as cron from "node-cron";
import OrderModel from "../schemas/Order";
import ProductModel from "../schemas/Products";
import Ready from "../utils/Ready.event";

const event : BotEvent = {
    name: "ready",
    once: false,
    execute: async (client : Client) => {
        console.log(
            color("text", `💪 Вошел в систему как ${color("variable", client.user?.tag)}`)
        )
        
        new Ready().run(client);

        async function dataHandler() {
            const data = await ProductModel.find({});
            data.forEach(async (product : IProducts) => {
                const date = new Date;
                if (date >= (new Date(product.time))) {
                    await product.deleteOne();
                }
            })
        }
        dataHandler();
        setTimeout(() => {
            dataHandler();
        }, 10_000)

        cron.schedule('0 0 * * 0', async () => {
            await OrderModel.deleteMany({});

        }, {
            scheduled: true,
            timezone: "Europe/Moscow" 
        });
            }
        }

export default event;