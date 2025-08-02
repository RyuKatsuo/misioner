<?php

use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\ChildrenAdminController;
use App\Http\Controllers\Admin\ClassController;
use App\Http\Controllers\Admin\EnrollClassController;
use App\Http\Controllers\Admin\GraduateChildrenController;
use App\Http\Controllers\admin\LoginAdminController;
use App\Http\Controllers\admin\PeriodController;
use App\Http\Controllers\Admin\SessionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SetPasswordController;
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
        Route::get('/periods', 'index')->name('period.index')->middleware('permission:admin.period.view_list');
        Route::get('/periods/create', 'create')->name('period.create')->middleware('permission:admin.period.create');
        Route::post('/periods', 'store')->name('period.store')->middleware('permission:admin.period.create');
        Route::get('/periods/{period}/edit', 'edit')->name('period.edit')->middleware('permission:admin.period.edit');
        Route::put('/periods/{period}', 'update')->name('period.update')->middleware('permission:admin.period.edit');
        Route::delete('/periods/{period}', 'destroy')->name('period.destroy')->middleware('permission:admin.period.delete');
    });

    Route::controller(ClassController::class)->group(function(){
        Route::get('/classes', 'index')->name('class.index')->middleware('permission:admin.class.view_list');
        Route::get('/classes/create', 'create')->name('class.create')->middleware('permission:admin.class.create');
        Route::post('/classes', 'store')->name('class.store')->middleware('permission:admin.class.create');
        Route::get('/classes/{class}/edit', 'edit')->name('class.edit')->middleware('permission:admin.class.create');
        Route::put('/classes/{class}', 'update')->name('class.update')->middleware('permission:admin.class.create');
        Route::get('/classes/{class}', 'show')->name('class.show')->middleware('permission:admin.class.show');
        Route::delete('/classes/{class}', 'destroy')->name('class.destroy')->middleware('permission:admin.class.delete');
    });
    
    Route::controller(EnrollClassController::class)->group(function(){
        Route::get('/classes/{class}/enroll', 'showEnrollForm')->name('class.enroll.form')->middleware('permission:admin.class.enroll');
        Route::post('/classes/{class}/enroll', 'enroll')->name('class.enroll.store')->middleware('permission:admin.class.enroll');
        Route::delete('/classes/{class}/unenroll/{child}', 'unenroll')->name('class.unenroll')->middleware('permission:admin.class.unenroll');
    });

    Route::controller(ChildrenAdminController::class)->group(function() {
        Route::get('/childrens', 'index')->name('children.index')->middleware('permission:admin.children.view_list');
        Route::get('/childrens/{child}', 'show')->name('children.show')->middleware();
    });

    Route::controller(GraduateChildrenController::class)->group(function() {
        Route::get('/classes/{class}/graduate', 'showGraduateForm')->name('class.graduate.form')->middleware('permission:admin.class.graduate');
        Route::post('/classes/{class}/graduate', 'store')->name('class.graduate.store')->middleware('permission:admin.class.graduate');
        Route::delete('/ungraduate/{child}', 'ungraduate')->name('class.ungraduate')->middleware('permission:admin.class.ungraduate');
    });

    Route::controller(UserController::class)
        ->as('users.')
        ->group(function () {
            Route::get('/users', 'index')->name('index')->middleware('permission:admin.user.view_list');
            Route::get('/users/create', 'create')->name('create')->middleware('permission:admin.user.create');
            Route::post('/users', 'store')->name('store')->middleware('permission:admin.user.create');
            Route::post('/users/{admin}/send-set-password', 'sendSetPasswordLink')->name('send_set_password_link')->middleware('permission:admin.user.send_password');
            Route::delete('/users/{admin}', 'destroy')->name('destroy')->middleware('permission:admin.user.delete');
    });

    Route::controller(SessionController::class)
        ->as('session.')
        ->group(function() {
            Route::get('/sessions', 'index')->name('index')->middleware('permission:admin.session.view_list');
            Route::post('/sessions', 'store')->name('store')->middleware('permission:admin.session.create');
            Route::get('/sessions/{session}', 'show')->name('show')->middleware('permission:admin.session.show');
            Route::get('/sessions/{session}/edit', 'edit')->name('edit')->middleware('permission:admin.session.edit');
            Route::put('/sessions/{session}', 'update')->name('update')->middleware('permission:admin.session.edit');
    });

    Route::controller(AttendanceController::class)
        ->as('attendances.')
        ->group(function() {
            Route::get('/attendances/{session}', 'show')->name('show');
            Route::post('/attendances/{session}/check-in', 'checkIn')->name('check-in')->middleware('permission:admin.session.attendance');
        });
});

Route::get('/set-password/{admin}', [SetPasswordController::class, 'create'])->middleware('signed')
    ->name('password.set');

Route::post('/set-password/{admin}', [SetPasswordController::class, 'store'])
    ->name('user.password.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
