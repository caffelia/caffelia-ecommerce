import { model } from "@medusajs/framework/utils"

const ChatSession = model.define("chat_session", {
  wa_id: model.text().primaryKey(),
  cart_id: model.text().nullable(),
  current_state: model.text().nullable(),
  state_data: model.json().nullable(),
})

export default ChatSession
