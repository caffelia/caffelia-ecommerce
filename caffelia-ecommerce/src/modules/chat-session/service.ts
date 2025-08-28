import { MedusaService } from "@medusajs/framework/utils"
import ChatSession from "./models/chat-session"

class ChatSessionModuleService extends MedusaService({
  ChatSession,
}){
}

export default ChatSessionModuleService
