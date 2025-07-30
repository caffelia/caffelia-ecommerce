import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms & Conditions of Caffelia",
}

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p className="mb-4">
        These are the terms and conditions for Caffelia. By using our website, you agree to these terms and conditions.
      </p>
      <h2 className="text-2xl font-bold mb-2">Orders</h2>
      <p className="mb-4">
        All orders are subject to availability and confirmation of the order price.
      </p>
      <h2 className="text-2xl font-bold mb-2">Shipping</h2>
      <p className="mb-4">
        Shipping times may vary according to availability and any guarantees or representations made as to delivery times are subject to any delays resulting from postal delays or force majeure for which we will not be responsible.
      </p>
      <h2 className="text-2xl font-bold mb-2">Returns</h2>
      <p className="mb-4">
        We have a 30-day return policy. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.
      </p>
      <h2 className="text-2xl font-bold mb-2">Changes to These Terms</h2>
      <p className="mb-4">
        We may update these terms and conditions from time to time. We will notify you of any changes by posting the new terms and conditions on this page.
      </p>
    </div>
  )
}
