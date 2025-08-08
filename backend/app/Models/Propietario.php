<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Propietario extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'propietarios';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cedula',
        'primer_nombre',
        'segundo_nombre',
        'apellidos',
        'direccion',
        'telefono',
        'ciudad',
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
     * Get the vehicles for the propietario.
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    /**
     * Get the propietario's full name.
     */
    public function getNombreCompletoAttribute()
    {
        $nombre = $this->primer_nombre;
        
        if ($this->segundo_nombre) {
            $nombre .= ' ' . $this->segundo_nombre;
        }
        
        if ($this->apellidos) {
            $nombre .= ' ' . $this->apellidos;
        }
        
        return $nombre;
    }

    /**
     * Get the propietario's formatted cedula.
     */
    public function getCedulaFormateadaAttribute()
    {
        $cedula = preg_replace('/[^0-9]/', '', $this->cedula);
        
        if (strlen($cedula) === 10) {
            return substr($cedula, 0, 2) . '.' . 
                   substr($cedula, 2, 3) . '.' . 
                   substr($cedula, 5, 3) . '-' . 
                   substr($cedula, 8);
        }
        
        return $this->cedula;
    }

    /**
     * Get the propietario's formatted phone number.
     */
    public function getTelefonoFormateadoAttribute()
    {
        $telefono = preg_replace('/[^0-9]/', '', $this->telefono);
        
        if (strlen($telefono) === 10) {
            return substr($telefono, 0, 3) . '-' . 
                   substr($telefono, 3, 3) . '-' . 
                   substr($telefono, 6);
        }
        
        return $this->telefono;
    }

    /**
     * Scope a query to only include active propietarios.
     */
    public function scopeActivo($query)
    {
        return $query->where('estado', 'activo');
    }

    /**
     * Scope a query to only include propietarios without vehicles.
     */
    public function scopeSinVehiculos($query)
    {
        return $query->whereDoesntHave('vehicles', function ($q) {
            $q->where('estado', 'activo');
        });
    }

    /**
     * Get propietario statistics.
     */
    public function getEstadisticasAttribute()
    {
        return [
            'total_vehiculos' => $this->vehicles()->activo()->count(),
            'vehiculos_publicos' => $this->vehicles()->activo()->publico()->count(),
            'vehiculos_particulares' => $this->vehicles()->activo()->particular()->count(),
            'placas_propiedad' => $this->vehicles()->activo()->pluck('placa')->implode(', '),
        ];
    }

    /**
     * Validate cedula format.
     */
    public static function validateCedula($cedula)
    {
        return preg_match('/^\d{8,10}$/', $cedula);
    }

    /**
     * Validate phone number format.
     */
    public static function validateTelefono($telefono)
    {
        return preg_match('/^\d{10}$/', preg_replace('/[^0-9]/', '', $telefono));
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($propietario) {
            $propietario->fecha_registro = now();
            $propietario->estado = $propietario->estado ?? 'activo';
        });
    }
} 