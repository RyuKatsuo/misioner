<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Score extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'score',
        'task_id',
        'children_id',
    ];

    protected $casts = [
        'score' => 'integer',
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
     * Satu nilai milik satu anak.
     */
    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class, 'children_id');
    }

    /**
     * Satu nilai milik satu tugas.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}