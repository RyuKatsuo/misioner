<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Child extends Model
{
    use HasFactory;
    protected $table = 'childrens';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name', 'attendance_count', 'total_score', 'school',
        'hobby', 'date_of_birth', 'special_needs_status',
        'special_needs_description', 'gender', 'active',
        'parent_id', 'qr_code', 'class_id',
    ];

    protected $casts = [
        'active' => 'boolean',
        'special_needs_status' => 'boolean',
        'date_of_birth' => 'date',
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
     * Satu anak dimiliki oleh satu user (orang tua).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Satu anak milik satu kelas.
     */
    public function classModel(): BelongsTo
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    /**
     * Satu anak mungkin memiliki satu catatan kelulusan.
     */
    public function graduate(): HasOne
    {
        return $this->hasOne(Graduate::class, 'children_id');
    }
}