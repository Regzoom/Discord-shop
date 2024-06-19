import { Schema, model } from "mongoose";
import { type IProducts } from "../types";

const ProductSchema = new Schema<IProducts>({
    name: { type: String, required: true },
    url: { type: String, required: true },
    time: { type: Date, required: true },
})

const ProductModel = model("product", ProductSchema)

export default ProductModel