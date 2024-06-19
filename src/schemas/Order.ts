import { Schema, model } from "mongoose";
import { type IOrder } from "../types";

const OrderSchema = new Schema<IOrder>({
    seller: { type: String, required: true },
    name: { type: String, required: true },
    valute: { type: String, required: true },
    price: { type: Number, required: true },
    buyer: { type: String, required: true },
})

const OrderModel = model("order", OrderSchema)

export default OrderModel