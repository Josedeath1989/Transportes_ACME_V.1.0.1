<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropietarioRequest extends FormRequest
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
            'cedula' => 'required|string|max:20|unique:propietarios,cedula',
            'primer_nombre' => 'required|string|max:50',
            'segundo_nombre' => 'nullable|string|max:50',
            'apellidos' => 'required|string|max:100',
            'direccion' => 'required|string|max:200',
            'telefono' => 'required|string|max:20',
            'ciudad' => 'required|string|max:100',
            'email' => 'nullable|email|max:100|unique:propietarios,email',
            'fecha_nacimiento' => 'nullable|date',
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
            'cedula.unique' => 'La cédula ya está registrada en el sistema',
            'cedula.required' => 'La cédula es obligatoria',
            'primer_nombre.required' => 'El primer nombre es obligatorio',
            'apellidos.required' => 'Los apellidos son obligatorios',
            'direccion.required' => 'La dirección es obligatoria',
            'telefono.required' => 'El teléfono es obligatorio',
            'ciudad.required' => 'La ciudad es obligatoria',
            'email.email' => 'El formato del email no es válido',
            'email.unique' => 'El email ya está registrado',
        ];
    }
}
