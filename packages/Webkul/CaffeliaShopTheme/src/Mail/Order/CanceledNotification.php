<?php

namespace Caffelia\ShopTheme\Mail\Order;

use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Caffelia\ShopTheme\Mail\Mailable;

class CanceledNotification extends Mailable
{
    /**
     * Create a new CanceledNotification instance.
     *
     * @return void
     */
    public function __construct(public $order) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            to: [
                new Address($this->order->customer_email, $this->order->customer_full_name),
            ],
            subject: trans('admin::app.emails.orders.canceled.subject'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'caffelia-shop::emails.orders.canceled',
        );
    }
}
