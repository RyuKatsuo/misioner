<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif; color: #51545E;">

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f7; padding: 40px 0;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 24px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #eaeaec;">
                            <h1 style="margin: 0; font-size: 24px; color: #3d4852;">
                                {{ config('app.name') }}
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 32px;">

                            <h2 style="margin-top: 0; font-size: 22px; color: #3d4852;">
                                Verify Your Email Address
                            </h2>

                            <p style="font-size: 16px; line-height: 1.5em;">
                                Please click the button below to verify your email address.
                            </p>

                            <!-- Button -->
                            <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 30px auto;">
                                <tr>
                                    <td align="center" bgcolor="#2d3748" style="border-radius: 6px;">
                                        <a href="{{ $url }}"
                                           style="
                                                display: inline-block;
                                                padding: 12px 24px;
                                                font-size: 16px;
                                                color: #ffffff;
                                                text-decoration: none;
                                                font-weight: bold;
                                           ">
                                            Verify Email
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 16px; line-height: 1.5em;">
                                If you did not request this, please ignore this email.
                            </p>

                            <p style="font-size: 16px; line-height: 1.5em; margin-top: 32px;">
                                Thanks,<br>
                                {{ config('app.name') }}
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px; text-align: center; font-size: 12px; color: #a8aaaf; border-top: 1px solid #eaeaec;">
                            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>