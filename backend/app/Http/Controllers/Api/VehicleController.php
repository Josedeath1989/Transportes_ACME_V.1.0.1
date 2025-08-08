<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller as BaseController;
use App\Models\Vehicle;
use App\Models\Conductor;
use App\Models\Propietario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class VehicleController extends BaseController
{
    /**
     * Display a listing of vehicles.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Vehicle::with(['conductor', 'propietario'])->activo();

            // Search functionality
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('placa', 'LIKE', "%{$search}%")
                      ->orWhere('marca', 'LIKE', "%{$search}%")
                      ->orWhere('color', 'LIKE', "%{$search}%");
                });
            }

            // Filter by type
            if ($request->has('tipo') && $request->tipo) {
                $query->where('tipo_vehiculo', $request->tipo);
            }

            // Pagination
            $perPage = $request->get('per_page', 10);
            $vehicles = $query->orderBy('fecha_registro', 'desc')
                             ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $vehicles->items(),
                'pagination' => [
                    'current_page' => $vehicles->currentPage(),
                    'last_page' => $vehicles->lastPage(),
                    'per_page' => $vehicles->perPage(),
                    'total' => $vehicles->total(),
                ],
                'message' => 'Vehículos obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener vehículos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created vehicle.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'placa' => 'required|string|max:10|unique:vehicles,placa',
                'color' => 'required|string|max:50',
                'marca' => 'required|string|max:100',
                'tipo_vehiculo' => 'required|in:particular,publico',
                'conductor_id' => 'required|exists:conductores,id',
                'propietario_id' => 'required|exists:propietarios,id',
            ], [
                'placa.unique' => 'La placa ya está registrada en el sistema',
                'conductor_id.exists' => 'El conductor seleccionado no existe',
                'propietario_id.exists' => 'El propietario seleccionado no existe',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validate placa format
            if (!Vehicle::validatePlaca($request->placa)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Formato de placa inválido. Use formato ABC123 o ABC12A'
                ], 422);
            }

            DB::beginTransaction();

            $vehicle = Vehicle::create([
                'placa' => strtoupper($request->placa),
                'color' => $request->color,
                'marca' => $request->marca,
                'tipo_vehiculo' => $request->tipo_vehiculo,
                'conductor_id' => $request->conductor_id,
                'propietario_id' => $request->propietario_id,
            ]);

            $vehicle->load(['conductor', 'propietario']);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $vehicle,
                'message' => 'Vehículo registrado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar vehículo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified vehicle.
     */
    public function show(Vehicle $vehicle): JsonResponse
    {
        try {
            $vehicle->load(['conductor', 'propietario']);

            return response()->json([
                'success' => true,
                'data' => $vehicle,
                'message' => 'Vehículo obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener vehículo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified vehicle.
     */
    public function update(Request $request, Vehicle $vehicle): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'placa' => 'sometimes|required|string|max:10|unique:vehicles,placa,' . $vehicle->id,
                'color' => 'sometimes|required|string|max:50',
                'marca' => 'sometimes|required|string|max:100',
                'tipo_vehiculo' => 'sometimes|required|in:particular,publico',
                'conductor_id' => 'sometimes|required|exists:conductores,id',
                'propietario_id' => 'sometimes|required|exists:propietarios,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validate placa format if provided
            if ($request->has('placa') && !Vehicle::validatePlaca($request->placa)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Formato de placa inválido. Use formato ABC123 o ABC12A'
                ], 422);
            }

            DB::beginTransaction();

            $vehicle->update($request->only([
                'placa', 'color', 'marca', 'tipo_vehiculo', 
                'conductor_id', 'propietario_id'
            ]));

            $vehicle->load(['conductor', 'propietario']);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $vehicle,
                'message' => 'Vehículo actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar vehículo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified vehicle.
     */
    public function destroy(Vehicle $vehicle): JsonResponse
    {
        try {
            DB::beginTransaction();

            $vehicle->update(['estado' => 'inactivo']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Vehículo eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar vehículo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vehicles for conductor selection.
     */
    public function getConductores(): JsonResponse
    {
        try {
            $conductores = Conductor::activo()
                ->select('id', 'cedula', 'primer_nombre', 'segundo_nombre', 'apellidos')
                ->orderBy('apellidos')
                ->orderBy('primer_nombre')
                ->get()
                ->map(function ($conductor) {
                    return [
                        'id' => $conductor->id,
                        'nombre_completo' => $conductor->nombre_completo,
                        'cedula' => $conductor->cedula_formateada,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $conductores,
                'message' => 'Conductores obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener conductores: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get propietarios for selection.
     */
    public function getPropietarios(): JsonResponse
    {
        try {
            $propietarios = Propietario::activo()
                ->select('id', 'cedula', 'primer_nombre', 'segundo_nombre', 'apellidos')
                ->orderBy('apellidos')
                ->orderBy('primer_nombre')
                ->get()
                ->map(function ($propietario) {
                    return [
                        'id' => $propietario->id,
                        'nombre_completo' => $propietario->nombre_completo,
                        'cedula' => $propietario->cedula_formateada,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $propietarios,
                'message' => 'Propietarios obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener propietarios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vehicle statistics.
     */
    public function getEstadisticas(): JsonResponse
    {
        try {
            $stats = [
                'total_vehiculos' => Vehicle::activo()->count(),
                'vehiculos_publicos' => Vehicle::activo()->publico()->count(),
                'vehiculos_particulares' => Vehicle::activo()->particular()->count(),
                'total_conductores' => Conductor::activo()->count(),
                'total_propietarios' => Propietario::activo()->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
} 