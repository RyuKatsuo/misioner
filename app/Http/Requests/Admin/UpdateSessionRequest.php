<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSessionRequest extends FormRequest
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
            'topic' => 'nullable|string|max:255',
            'attendances' => 'required|array',

            // Validasi untuk setiap item di dalam array 'attendances'
            'attendances.*.child_id' => 'required|uuid|exists:childrens,id', // <-- Pastikan child_id ada
            'attendances.*.status' => [
                'required',
                'string',
                Rule::in(['Present', 'Late', 'Absent', 'Excused']), // <-- Pastikan statusnya valid
            ],
        ];
    }
}
