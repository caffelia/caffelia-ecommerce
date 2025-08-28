import GeoModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const GEO_MODULE = "geo"

export default Module(GEO_MODULE, {
  service: GeoModuleService,
})


