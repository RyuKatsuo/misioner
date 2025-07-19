<?php

use App\Http\Controllers\admin\LoginAdminController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {

        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('/auth/admin')->name('admin.')->group(function(){
    Route::controller(LoginAdminController::class)->group(function(){
        Route::get('/login', 'create')->middleware('guest:admin')->name('login.form');
        Route::post('/login', 'store')->middleware('guest:admin')->name('login.store');
        Route::post('/logout', 'destroy')->middleware('auth:admin')->name('logout');
    });
});

Route::prefix('admin')->name('admin.')->middleware('auth:admin')->group(function(){
    Route::get('/dashboard', function (){
        return Inertia::render('admin/dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
