import { MedusaService } from "@medusajs/framework/utils"
import ColDepartment from "./models/col-department"
import ColMunicipality from "./models/col-municipality"

class GeoModuleService extends MedusaService({
  ColDepartment,
  ColMunicipality,
}) {}

export default GeoModuleService


