import { model } from "@medusajs/framework/utils"

const ColMunicipality = model.define("col_municipality", {
  muni_code: model.text().primaryKey(),
  dept_code: model.text(),
  name: model.text(),
  type: model.text().nullable(),
  longitude: model.number().nullable(),
  latitude: model.number().nullable(),
  dane_code: model.text(),
})

export default ColMunicipality


