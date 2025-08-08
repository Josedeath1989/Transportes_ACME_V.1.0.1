<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller as BaseController;
use App\Models\Conductor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ConductorController extends BaseController
{
    /**
     * Display a listing of conductors.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Conductor::activo();

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
            $conductores = $query->orderBy('fecha_registro', 'desc')
                                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $conductores->items(),
                'pagination' => [
                    'current_page' => $conductores->currentPage(),
                    'last_page' => $conductores->lastPage(),
                    'per_page' => $conductores->perPage(),
                    'total' => $conductores->total(),
                ],
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
     * Store a newly created conductor.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'cedula' => 'required|string|max:20|unique:conductores,cedula',
                'primer_nombre' => 'required|string|max:50',
                'segundo_nombre' => 'nullable|string|max:50',
                'apellidos' => 'required|string|max:100',
                'direccion' => 'required|string|max:200',
                'telefono' => 'required|string|max:20',
                'ciudad' => 'required|string|max:100',
            ], [
                'cedula.unique' => 'La cédula ya está registrada en el sistema',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $conductor = Conductor::create($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $conductor,
                'message' => 'Conductor creado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear conductor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified conductor.
     */
    public function show(Conductor $conductor): JsonResponse
    {
        try {
            $conductor->load('vehicles');

            return response()->json([
                'success' => true,
                'data' => $conductor,
                'message' => 'Conductor obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener conductor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified conductor.
     */
    public function update(Request $request, Conductor $conductor): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'cedula' => 'required|string|max:20|unique:conductores,cedula,' . $conductor->id,
                'primer_nombre' => 'required|string|max:50',
                'segundo_nombre' => 'nullable|string|max:50',
                'apellidos' => 'required|string|max:100',
                'direccion' => 'required|string|max:200',
                'telefono' => 'required|string|max:20',
                'ciudad' => 'required|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $conductor->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $conductor,
                'message' => 'Conductor actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar conductor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified conductor.
     */
    public function destroy(Conductor $conductor): JsonResponse
    {
        try {
            // Check if conductor has vehicles
            if ($conductor->vehicles()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el conductor porque tiene vehículos asignados'
                ], 422);
            }

            DB::beginTransaction();

            $conductor->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Conductor eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar conductor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get conductor statistics.
     */
    public function getEstadisticas(): JsonResponse
    {
        try {
            $stats = [
                'total' => Conductor::count(),
                'activos' => Conductor::activo()->count(),
                'con_vehiculos' => Conductor::has('vehicles')->count(),
                'sin_vehiculos' => Conductor::doesntHave('vehicles')->count(),
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
