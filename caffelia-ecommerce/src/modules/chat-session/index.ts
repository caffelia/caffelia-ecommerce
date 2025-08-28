import ChatSessionModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CHAT_SESSION_MODULE = "chat_session"

// La definición del módulo que enlaza el nombre con el servicio
export default Module(CHAT_SESSION_MODULE, {
  service: ChatSessionModuleService,
})
