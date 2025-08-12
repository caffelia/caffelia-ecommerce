import { model } from "@medusajs/framework/utils"

const ActiveCart = model.define("active_cart", {
  user_id: model.id().primaryKey(),
  cart_id: model.text(),
})

export default ActiveCart