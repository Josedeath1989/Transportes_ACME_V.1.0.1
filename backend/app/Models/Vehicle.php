<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vehicles';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'placa',
        'color',
        'marca',
        'tipo_vehiculo',
        'conductor_id',
        'propietario_id',
        'estado',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fecha_registro' => 'datetime',
        'estado' => 'string',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'deleted_at',
    ];

    /**
     * Get the conductor that owns the vehicle.
     */
    public function conductor(): BelongsTo
    {
        return $this->belongsTo(Conductor::class);
    }

    /**
     * Get the propietario that owns the vehicle.
     */
    public function propietario(): BelongsTo
    {
        return $this->belongsTo(Propietario::class);
    }

    /**
     * Scope a query to only include active vehicles.
     */
    public function scopeActivo($query)
    {
        return $query->where('estado', 'activo');
    }

    /**
     * Scope a query to only include public vehicles.
     */
    public function scopePublico($query)
    {
        return $query->where('tipo_vehiculo', 'publico');
    }

    /**
     * Scope a query to only include private vehicles.
     */
    public function scopeParticular($query)
    {
        return $query->where('tipo_vehiculo', 'particular');
    }

    /**
     * Get the vehicle's full information for reports.
     */
    public function getReporteInfoAttribute()
    {
        return [
            'placa' => $this->placa,
            'marca' => $this->marca,
            'color' => $this->color,
            'tipo_vehiculo' => $this->tipo_vehiculo,
            'nombre_conductor' => $this->conductor->nombre_completo ?? 'N/A',
            'nombre_propietario' => $this->propietario->nombre_completo ?? 'N/A',
            'fecha_registro' => $this->fecha_registro->format('d/m/Y H:i:s'),
        ];
    }

    /**
     * Validate placa format.
     */
    public static function validatePlaca($placa)
    {
        return preg_match('/^[A-Z]{3}\d{3}$|^[A-Z]{3}\d{2}[A-Z]$/', strtoupper($placa));
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($vehicle) {
            $vehicle->fecha_registro = now();
            $vehicle->estado = $vehicle->estado ?? 'activo';
        });
    }
} 