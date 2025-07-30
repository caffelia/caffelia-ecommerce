import type { StoreProductParams as OriginalStoreProductParams } from "@medusajs/types"

declare module "@medusajs/types" {
  export interface StoreProductParams extends OriginalStoreProductParams {
    collection_id?: string[]
  }
}