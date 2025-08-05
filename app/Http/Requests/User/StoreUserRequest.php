<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class StoreUserRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone_number' => ['required', 'string', 'max:15'],
            'gender' => ['required', 'string', 'in:Male,Female'],
            'date_of_birth' => ['required', 'date'],
            'community_option' => ['required', 'string', 'in:listed,outside'],
            'community_id' => ['required_if:community_option,listed', 'nullable', 'uuid', 'exists:communities,id'],
            'outside_community_address' => ['required_if:community_option,outside', 'nullable', 'string'],
        ];
    }
}
