<?php

use App\Http\Controllers\Admin\ChildrenAdminController;
use App\Http\Controllers\Admin\ClassController;
use App\Http\Controllers\Admin\EnrollClassController;
use App\Http\Controllers\admin\LoginAdminController;
use App\Http\Controllers\admin\PeriodController;
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

    Route::controller(PeriodController::class)->group(function(){
        Route::get('/periods', 'index')->name('period.index');
        Route::get('/periods/create', 'create')->name('period.create');
        Route::post('/periods', 'store')->name('period.store');
        Route::get('/periods/{period}/edit', 'edit')->name('period.edit');
        Route::put('/periods/{period}', 'update')->name('period.update');
        Route::delete('/periods/{period}', 'destroy')->name('period.destroy');
    });

    Route::controller(ClassController::class)->group(function(){
        Route::get('/classes', 'index')->name('class.index');
        Route::get('/classes/create', 'create')->name('class.create');
        Route::post('/classes', 'store')->name('class.store');
        Route::get('/classes/{class}/edit', 'edit')->name('class.edit');
        Route::put('/classes/{class}', 'update')->name('class.update');
        Route::get('/classes/{class}', 'show')->name('class.show');
        Route::delete('/classes/{class}', 'destroy')->name('class.destroy');


    });
    
    Route::controller(EnrollClassController::class)->group(function(){
        Route::get('/classes/{class}/enroll', 'showEnrollForm')->name('class.enroll.form');
        Route::post('/classes/{class}/enroll', 'enroll')->name('class.enroll.store');
        Route::delete('/classes/{class}/unenroll/{child}', 'unenroll')->name('class.unenroll');
    });

    Route::controller(ChildrenAdminController::class)->group(function() {
        Route::get('/childrens', 'index')->name('children.index');
        Route::get('/childrens/{child}', 'show')->name('children.show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
