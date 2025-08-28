import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const geo = req.scope.resolve("geo") as any
  const departments = await geo.listColDepartments({}, { orderBy: { dept_code: "asc" } })
  res.json({ departments })
}


