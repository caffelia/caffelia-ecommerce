import { MedusaService } from "@medusajs/framework/utils"
import ActiveCart from "./models/active-cart"

// The service extends a base class from MedusaService [cite: 187]
// Pass the data models to generate methods for them [cite: 189]
class CartSessionModuleService extends MedusaService({
  ActiveCart,
}){
}

export default CartSessionModuleService