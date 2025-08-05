<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ClassModel extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang digunakan oleh model ini.
     * Wajib didefinisikan karena nama kelas (ClassModel) berbeda dari nama tabel (class).
     *
     * @var string
     */
    protected $table = 'class';

    /**
     * Menandakan bahwa ID tidak auto-increment.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Tipe data dari primary key.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'period_id',
        'class_name',
    ];

    /**
     * Boot method untuk model.
     * Secara otomatis membuat UUID saat data baru dibuat.
     */
    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid();
            }
        });

         static::deleting(function (ClassModel $class) {
            // Loop semua anak yang ada di kelas ini
            foreach ($class->childrens as $child) {
                // Set anak menjadi tidak aktif
                $child->is_active = false;
                $child->class_id = null;
                $child->save();
            }
        });
    }

    /**
     * Mendefinisikan relasi "milik" ke model Period.
     * Satu kelas hanya memiliki satu periode.
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    /**
     * Mendefinisikan relasi "memiliki banyak" ke model Children.
     * Satu kelas memiliki banyak anak.
     */
    public function childrens(): HasMany
    {
        return $this->hasMany(Child::class, 'class_id');
    }

    public function sessions(): HasMany 
    {
        return $this->hasMany(Session::class, 'class_id');
    }
}