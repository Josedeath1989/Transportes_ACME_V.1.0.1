<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller as BaseController;
use App\Models\Propietario;
use App\Http\Requests\StorePropietarioRequest;
use App\Http\Requests\UpdatePropietarioRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropietarioController extends BaseController
{
    /**
     * Display a listing of propietarios.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Propietario::activo();

            // Search functionality
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('cedula', 'LIKE', "%{$search}%")
                      ->orWhere('primer_nombre', 'LIKE', "%{$search}%")
                      ->orWhere('apellidos', 'LIKE', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 10);
            $propietarios = $query->orderBy('fecha_registro', 'desc')
                                 ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $propietarios->items(),
                'pagination' => [
                    'current_page' => $propietarios->currentPage(),
                    'last_page' => $propietarios->lastPage(),
                    'per_page' => $propietarios->perPage(),
                    'total' => $propietarios->total(),
                ],
                'message' => 'Propietarios obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener propietarios: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener propietarios',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Store a newly created propietario.
     */
    public function store(StorePropietarioRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $propietario = Propietario::create($request->validated());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $propietario,
                'message' => 'Propietario creado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear propietario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear propietario',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Display the specified propietario.
     */
    public function show(Propietario $propietario): JsonResponse
    {
        try {
            $propietario->load('vehicles');

            return response()->json([
                'success' => true,
                'data' => $propietario,
                'message' => 'Propietario obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener propietario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener propietario',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Update the specified propietario.
     */
    public function update(UpdatePropietarioRequest $request, Propietario $propietario): JsonResponse
    {
        try {
            DB::beginTransaction();

            $propietario->update($request->validated());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $propietario,
                'message' => 'Propietario actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar propietario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar propietario',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Remove the specified propietario.
     */
    public function destroy(Propietario $propietario): JsonResponse
    {
        try {
            // Check if propietario has vehicles
            if ($propietario->vehicles()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el propietario porque tiene vehículos asignados'
                ], 422);
            }

            DB::beginTransaction();

            $propietario->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Propietario eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al eliminar propietario: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar propietario',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Get propietario statistics.
     */
    public function getEstadisticas(): JsonResponse
    {
        try {
            $stats = [
                'total' => Propietario::count(),
                'activos' => Propietario::activo()->count(),
                'con_vehiculos' => Propietario::has('vehicles')->count(),
                'sin_vehiculos' => Propietario::doesntHave('vehicles')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }
}
