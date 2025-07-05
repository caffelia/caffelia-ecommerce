<?php

namespace Webkul\MercadoPago\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Webkul\Sales\Repositories\OrderTransactionRepository;
use Webkul\MercadoPago\Payment\CheckoutPro;

class Transaction
{
    /**
     * Create a new listener instance.
     *
     * @return void
     */
    public function __construct(
        protected OrderTransactionRepository $orderTransactionRepository,
        protected CheckoutPro $checkoutPro
    )
    {
    }

    /**
     * Save transaction.
     *
     * @param  \Webkul\Sales\Models\Invoice  $invoice
     * @return void
     */
    public function saveTransaction($invoice)
    {
        if (
            ! $invoice->can_create_transaction
            || $invoice->order->payment->method !== 'mercado_pago'
        ) {
            return;
        }

        $data = request()->all();

        // TODO: Get transaction details from MercadoPago
        // The following is a placeholder and needs to be implemented
        // based on how MercadoPago returns transaction data.
        // $transactionDetails = $this->checkoutPro->getTransactionDetails($data);

        $this->orderTransactionRepository->create([
            'transaction_id' => $data['payment_id'] ?? null,
            'status'         => $data['status'] ?? null,
            'type'           => $invoice->order->payment->method,
            'payment_method' => $invoice->order->payment->method,
            'order_id'       => $invoice->order->id,
            'invoice_id'     => $invoice->id,
            'data'           => json_encode($data),
        ]);
    }
}
