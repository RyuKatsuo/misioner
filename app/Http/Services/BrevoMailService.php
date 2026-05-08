<?php

namespace App\Http\Services;

use Brevo\Brevo;
use Brevo\TransactionalEmails\Requests\SendTransacEmailRequest;
use Brevo\TransactionalEmails\Types\SendTransacEmailRequestSender;
use Brevo\TransactionalEmails\Types\SendTransacEmailRequestToItem;

class BrevoMailService
{
    protected Brevo $client;

    public function __construct()
    {
        $this->client = new Brevo(
            apiKey: env('BREVO_API_KEY'),
        );
    }

    public function send($to, $subject, $htmlContent)
    {
        return $this->client->transactionalEmails->sendTransacEmail(
            new SendTransacEmailRequest([
                'htmlContent' => $htmlContent,

                'sender' => new SendTransacEmailRequestSender([
                    'email' => env('MAIL_FROM_ADDRESS'),
                    'name' => env('MAIL_FROM_NAME'),
                ]),

                'subject' => $subject,

                'to' => [
                    new SendTransacEmailRequestToItem([
                        'email' => $to,
                    ]),
                ],
            ])
        );
    }
}