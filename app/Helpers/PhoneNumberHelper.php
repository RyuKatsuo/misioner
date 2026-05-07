<?php

namespace App\Helpers;

class PhoneNumberHelper {
    public static function format($number) {
        $number = preg_replace('/[^0-9]/', '', $number);

        if (preg_match('/^0/', $number)) {
            $number = '62'.substr($number, 1);
        }

        if (preg_match('/^8/', $number)) {
            $number = '62'.$number;
        }

        return $number;
    }
}
