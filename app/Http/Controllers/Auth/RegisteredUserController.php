<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\PhoneNumberHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Models\Community;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $communities = Community::get(['id', 'community_name']);
        
        return Inertia::render('auth/register', [
            'communities' => $communities
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone_number' => PhoneNumberHelper::format($data['phone_number']),
            'gender' => $data['gender'],
            'date_of_birth' => $data['date_of_birth'],
            'community_id' => $data['community_option'] === 'listed' ? $data['community_id'] : null,
            'outside_community' => $data['community_option'] === 'outside',
            'outside_community_address' => $data['community_option'] === 'outside' ? $data['outside_community_address'] : null,
        ]);

        $user->assignRole('Parent');

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('children.index', absolute: false));
    }
}
