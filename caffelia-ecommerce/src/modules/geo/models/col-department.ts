import { model } from "@medusajs/framework/utils"

const ColDepartment = model.define("col_department", {
  dept_code: model.text().primaryKey(),
  name: model.text(),
  dane_code: model.text(),
})

export default ColDepartment


