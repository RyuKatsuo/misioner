<?php

namespace App\Http\Requests\Admin;

use App\Models\Child;
use Illuminate\Foundation\Http\FormRequest;

class EnrollChildrenRequest extends FormRequest
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
            'children_ids' => ['required', 'array', 'min:1'],
            'children_ids.*' => [
                'required',
                'uuid',
                // Pastikan ID anak ada di tabel 'childrens'
                'exists:childrens,id',
                // Aturan kustom untuk memastikan hanya anak yang valid yang bisa didaftarkan
                function (string $attribute, mixed $value, \Closure $fail) {
                    $child = Child::find($value);

                    // Cek jika anak tidak ditemukan (meskipun 'exists' sudah menangani ini)
                    if (!$child) {
                        return; // Aturan 'exists' akan memberikan pesan error
                    }

                    // Cek jika anak sebenarnya sudah aktif
                    if ($child->active) {
                        $fail("The child {$child->name} is already active.");
                    }

                    // Cek jika anak sebenarnya sudah lulus (memiliki data di tabel graduates)
                    if ($child->graduate()->exists()) {
                        $fail("The child {$child->name} has already graduated.");
                    }
                }
            ],
        ];
    }
}
