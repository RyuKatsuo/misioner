<?php

use App\Http\Controllers\Admin\Settings\ProfileAdminController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});


Route::prefix('admin/settings')
    ->middleware('auth.group:admin')
    ->name('admin.settings.')
    ->group(function () {
        
        Route::redirect('/', '/admin/settings/profile');

        Route::get('/profile', [ProfileAdminController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileAdminController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileAdminController::class, 'destroy'])->name('profile.destroy');

        // Rute pengaturan password & appearance untuk admin bisa ditambahkan di sini...
});