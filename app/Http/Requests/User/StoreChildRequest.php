<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreChildRequest extends FormRequest
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
            'gender' => ['required', 'string', 'in:Male,Female'],
            'date_of_birth' => ['required', 'date'],
            'school' => ['required', 'string', 'max:255'],
            'hobby' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048', 'mimes:png,jpg,jpeg,svg'],
            'special_needs_status' => ['required', 'boolean'],
            'special_needs_description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
