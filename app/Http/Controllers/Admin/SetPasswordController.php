<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePasswordRequest;
use App\Models\Admin;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class SetPasswordController extends Controller
{
    public function create(Admin $admin): Response
    {
        // Pastikan kita tidak menampilkan form untuk admin yang sudah punya password
        if ($admin->password) {
            abort(403, 'This link has already been used.');
        }

        return Inertia::render('auth/setPassword', [
            'admin' => $admin,
        ]);
    }

    public function store(StorePasswordRequest $request, Admin $admin): RedirectResponse
    {


        if ($admin->email !== $request->email) {
            return back()->with('error', 'Email does not match.');
        }
        $admin->update([
            'password' => Hash::make($request->password),
            'is_active' => true
        ]);

        return redirect()->route('login')->with('status', 'Password set successfully. You can now log in.');
    }
}
