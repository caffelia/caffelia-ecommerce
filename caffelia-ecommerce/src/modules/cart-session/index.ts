import CartSessionModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

// A unique name for your module, used for resolving it later [cite: 210, 213]
export const CART_SESSION_MODULE = "cart_session"

// Creates the module definition, linking the name to the service [cite: 209, 212]
export default Module(CART_SESSION_MODULE, {
  service: CartSessionModuleService,
})