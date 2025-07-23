<?php

namespace App\Http\Requests\Admin;

use App\Models\Period;
use Illuminate\Foundation\Http\FormRequest;

class StorePeriodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'is_active' => [
                'nullable', 
                'boolean',
                function (string $attribute, mixed $value, \Closure $fail) {
                    // Aturan ini hanya berjalan jika user mencoba mengaktifkan periode baru ($value == true)
                    if ($value) {
                        // Cek apakah sudah ada periode lain yang aktif
                        if (Period::where('is_active', true)->exists()) {
                            $fail('Another period is already active. Please deactivate it first.');
                        }
                    }
                }
            ],
        ];
    }
}
