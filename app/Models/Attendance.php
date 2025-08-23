<?php

namespace App\Models;

use App\Enums\AttendanceStatus; // Impor Enum yang kita buat
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Attendance extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'session_id',
        'status',
        'admin_id',
        'children_id',
    ];

    protected $casts = [
        // Cast kolom 'status' ke kelas Enum
        'status' => AttendanceStatus::class,
    ];

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid();
            }
        });
    }

    /**
     * Satu catatan kehadiran milik satu anak.
     */
    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class, 'children_id');
    }

    /**
     * Satu catatan kehadiran dicatat oleh satu admin.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    /**
     * Satu catatan kehadiran milik satu sesi.
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }
}