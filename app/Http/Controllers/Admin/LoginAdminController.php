<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginAdminController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('admin/auth/login');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->validated();

        if (Auth::guard('admin')->attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended(route('admin.period.index'));
        }

        return back()->withErrors([
            'email' => 'Email atau password yang diberikan salah.',
        ])->onlyInput('email');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login.form');
    }
}
