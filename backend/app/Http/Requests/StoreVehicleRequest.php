<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'placa' => 'required|string|max:10|unique:vehicles,placa',
            'marca' => 'required|string|max:50',
            'modelo' => 'required|string|max:50',
            'tipo_vehiculo' => 'required|string|max:50',
            'capacidad' => 'required|integer|min:1',
            'propietario_id' => 'required|exists:propietarios,id',
            'conductor_id' => 'nullable|exists:conductores,id',
            'anio_fabricacion' => 'required|integer|min:1900|max:' . date('Y'),
            'color' => 'required|string|max:30',
            'numero_motor' => 'nullable|string|max:50',
            'numero_chasis' => 'nullable|string|max:50',
            'fecha_vencimiento_soat' => 'nullable|date|after:today',
            'fecha_vencimiento_tecnomecanica' => 'nullable|date|after:today',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'placa.unique' => 'La placa ya está registrada en el sistema',
            'placa.required' => 'La placa es obligatoria',
            'marca.required' => 'La marca es obligatoria',
            'modelo.required' => 'El modelo es obligatorio',
            'tipo_vehiculo.required' => 'El tipo de vehículo es obligatorio',
            'capacidad.required' => 'La capacidad es obligatoria',
            'capacidad.min' => 'La capacidad debe ser al menos 1',
            'propietario_id.required' => 'El propietario es obligatorio',
            'propietario_id.exists' => 'El propietario seleccionado no existe',
            'conductor_id.exists' => 'El conductor seleccionado no existe',
            'anio_fabricacion.required' => 'El año de fabricación es obligatorio',
            'color.required' => 'El color es obligatorio',
            'fecha_vencimiento_soat.after' => 'La fecha de vencimiento del SOAT debe ser posterior a hoy',
            'fecha_vencimiento_tecnomecanica.after' => 'La fecha de vencimiento de la tecnomecánica debe ser posterior a hoy',
        ];
    }
}
