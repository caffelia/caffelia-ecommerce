import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const geo = req.scope.resolve("geo") as any
  const dept_code = (req.query.dept_code as string) || ""
  if (!dept_code) {
    return res.status(400).json({ message: "dept_code is required" })
  }
  const municipalities = await geo.listColMunicipalities({ dept_code })
  res.json({ municipalities })
}


