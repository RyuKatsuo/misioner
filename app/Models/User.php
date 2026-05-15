<?php

namespace App\Models;

use App\Http\Services\BrevoMailService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, HasRoles, Notifiable;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        'gender',
        'is_active',
        'community_id',
        'date_of_birth',
        'outside_community',
        'outside_community_address',
        'email_verified_at',
        'remember_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'outside_community' => 'boolean',
        'email_verified_at' => 'datetime',
        'date_of_birth' => 'date',
    ];

    // UUID otomatis jika belum ada saat creating
    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid();
            }
        });
    }

    public function childrens(): HasMany
    {
        return $this->hasMany(Child::class, 'parent_id');
    }

    // Relasi ke Community
    // public function community()
    // {
    //     return $this->belongsTo(Community::class);
    // }

    public function sendEmailVerificationNotification()
    {
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $this->getKey(),
                'hash' => sha1($this->getEmailForVerification()),
            ]
        );

        $html = view('emails.verify-email', [
            'url' => $verificationUrl,
            'user' => $this,
        ])->render();

        $mailService = new BrevoMailService;

        $mailService->send(
            $this->email,
            'Verify Email Address',
            $html
        );
    }
}
