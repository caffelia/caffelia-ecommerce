<?php

namespace Caffelia\ShopTheme\Mail\Customer;

use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Webkul\Customer\Contracts\Customer;
use Caffelia\ShopTheme\Mail\Mailable;

class EmailVerificationNotification extends Mailable
{
    /**
     * Create a new mailable instance.
     *
     * @return void
     */
    public function __construct(public Customer $customer) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            to: [
                new Address($this->customer->email),
            ],
            subject: trans('caffelia-shop::app.emails.customers.verification.subject'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'caffelia-shop::emails.customers.email-verification',
        );
    }
}
