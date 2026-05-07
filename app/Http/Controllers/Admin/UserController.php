<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\PhoneNumberHelper;
use App\Http\Controllers\Controller;
use App\Mail\SetPasswordMail;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function index(Request $request): Response
    {
        $users = Admin::query()
            ->with('roles')
            ->whereDoesntHave('roles', function($query) {
                $query->where('name', 'Superadmin');
            })
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $roles = Role::where('name', '!=', 'Superadmin')
            ->where('name', '!=', 'Parent')
            ->get();
        return Inertia::render('admin/users/create', [
            'roles' => $roles
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . Admin::class,
            'role' => 'required|string|exists:roles,name|not_in:Superadmin,Parent',
            'phone_number' => 'required|string|max:15',
            'gender' => 'required|string'
        ]);

        // if ($request->phone_number && )

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'is_active' => false,
            'gender' => $request->gender,
            'phone_number' => PhoneNumberHelper::format($request->phone_number)
        ]);

        if ($request->filled('role')) {
            $admin->assignRole($request->role);
        }

        $this->sendSetPasswordLink($admin, false);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(Admin $admin): Response
    {
        $roles = Role::where('name', '!=', 'Superadmin')
            ->where('name', '!=', 'Parent')
            ->get();

        return Inertia::render('admin/users/edit', [
            'admin' => $admin->load('roles'),
            'roles' => $roles
        ]);
    }

    public function update(Request $request, Admin $admin): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . Admin::class . ',email,' . $admin->id,
            'role' => 'required|string|exists:roles,name|not_in:Superadmin,Parent',
            'phone_number' => 'required|string|max:15'
        ]);

        $admin->update($request->only(['name', 'email', 'phone_number']));

        if ($request->filled('role')) {
            $admin->syncRoles($request->role);
        }

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(Admin $admin): RedirectResponse
    {
        try {
            $admin->delete();
            return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
        } catch (\Throwable $th) {
            return redirect()->route('admin.users.index')->with('error', 'Failed to delete user.');
        }
    }

    /**
     * Send set password link to the user.
     *
     * @param User $user
     * @param bool $returnResponse // Tambahkan parameter untuk mengontrol output
     * @return RedirectResponse|void
     */
    public function sendSetPasswordLink(Admin $admin, $returnResponse = true)
    {
        if ($admin->password && $returnResponse) {
            return back()->with('error', 'This admin already has a password.');
        }

        // 1. Buat tautan yang aman dan berlaku selama 24 jam
        $link = URL::temporarySignedRoute(
            'password.set', // Nama rute untuk halaman form set password
            now()->addHours(24),
            ['admin' => $admin->id]
        );

        // 2. Kirim email ke pengguna
        Mail::to($admin->email)->send(new SetPasswordMail($link));

        // 3. Kembalikan dengan pesan sukses
        if ($returnResponse) {
            return back()->with('success', 'Set password link has been sent to the admin.');
        }
    }
}
