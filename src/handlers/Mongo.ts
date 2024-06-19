import mongoose from "mongoose";
import { color } from "../functions";

module.exports = () => {
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) return console.log(color("text",`🍃 Ссылка на базу данных не найдена, ${color("error", "пропускаю.")}`));
    mongoose.connect(`${MONGO_URI}`, { dbName: process.env.MONGODB_NAME })
    .then(() => console.log(color("text",`🍃 MongoDB успешно ${color("variable", "подключена.")}`)))
    .catch(() => console.log(color("text",`🍃 Произошел ${color("error", "сбой.")} подключения к MongoDB`)))
}