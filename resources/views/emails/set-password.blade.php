<x-mail::message>
# Set Your Account Password

Please click the button below to set a password for your new account. This link is valid for 24 hours.

<x-mail::button :url="$link">
Set Password
</x-mail::button>

If you did not request this, please ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>