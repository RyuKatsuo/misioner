<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

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
}
