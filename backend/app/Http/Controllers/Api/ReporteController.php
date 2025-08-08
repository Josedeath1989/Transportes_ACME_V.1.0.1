<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller as BaseController;
use App\Models\Vehicle;
use App\Models\Conductor;
use App\Models\Propietario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReporteController extends BaseController
{
    /**
     * Get main report.
     */
    public function reportePrincipal(): JsonResponse
    {
        try {
            $vehicles = Vehicle::with(['conductor', 'propietario'])
                ->activo()
                ->orderBy('fecha_registro', 'desc')
                ->get()
                ->map(function ($vehicle) {
                    return $vehicle->reporte_info;
                });

            return response()->json([
                'success' => true,
                'data' => $vehicles,
                'message' => 'Reporte principal obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reporte principal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get conductors report.
     */
    public function reporteConductores(): JsonResponse
    {
        try {
            $conductores = Conductor::with('vehicles')
                ->activo()
                ->orderBy('apellidos', 'asc')
                ->get()
                ->map(function ($conductor) {
                    return [
                        'id' => $conductor->id,
                        'cedula' => $conductor->cedula,
                        'nombre_completo' => $conductor->nombre_completo,
                        'direccion' => $conductor->direccion,
                        'telefono' => $conductor->telefono,
                        'ciudad' => $conductor->ciudad,
                        'vehiculos_asignados' => $conductor->vehicles->count(),
                        'fecha_registro' => $conductor->fecha_registro->format('d/m/Y H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $conductores,
                'message' => 'Reporte de conductores obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reporte de conductores: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get propietarios report.
     */
    public function reportePropietarios(): JsonResponse
    {
        try {
            $propietarios = Propietario::with('vehicles')
                ->activo()
                ->orderBy('apellidos', 'asc')
                ->get()
                ->map(function ($propietario) {
                    return [
                        'id' => $propietario->id,
                        'cedula' => $propietario->cedula,
                        'nombre_completo' => $propietario->nombre_completo,
                        'direccion' => $propietario->direccion,
                        'telefono' => $propietario->telefono,
                        'ciudad' => $propietario->ciudad,
                        'vehiculos_propiedad' => $propietario->vehicles->count(),
                        'fecha_registro' => $propietario->fecha_registro->format('d/m/Y H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $propietarios,
                'message' => 'Reporte de propietarios obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reporte de propietarios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get general statistics.
     */
    public function estadisticasGenerales(): JsonResponse
    {
        try {
            $stats = [
                'total_vehiculos' => Vehicle::count(),
                'vehiculos_activos' => Vehicle::activo()->count(),
                'vehiculos_particulares' => Vehicle::particular()->count(),
                'vehiculos_publicos' => Vehicle::publico()->count(),
                'total_conductores' => Conductor::count(),
                'conductores_activos' => Conductor::activo()->count(),
                'conductores_con_vehiculos' => Conductor::has('vehicles')->count(),
                'total_propietarios' => Propietario::count(),
                'propietarios_activos' => Propietario::activo()->count(),
                'propietarios_con_vehiculos' => Propietario::has('vehicles')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas generales obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas generales: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export data to CSV.
     */
    public function exportarCSV(Request $request): JsonResponse
    {
        try {
            $tipo = $request->get('tipo', 'vehiculos');
            
            switch ($tipo) {
                case 'vehiculos':
                    $data = Vehicle::with(['conductor', 'propietario'])->activo()->get();
                    break;
                case 'conductores':
                    $data = Conductor::activo()->get();
                    break;
                case 'propietarios':
                    $data = Propietario::activo()->get();
                    break;
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Tipo de exportación no válido'
                    ], 422);
            }

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Datos preparados para exportación CSV'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al exportar CSV: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export data to PDF.
     */
    public function exportarPDF(Request $request): JsonResponse
    {
        try {
            $tipo = $request->get('tipo', 'vehiculos');
            
            switch ($tipo) {
                case 'vehiculos':
                    $data = Vehicle::with(['conductor', 'propietario'])->activo()->get();
                    break;
                case 'conductores':
                    $data = Conductor::activo()->get();
                    break;
                case 'propietarios':
                    $data = Propietario::activo()->get();
                    break;
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Tipo de exportación no válido'
                    ], 422);
            }

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Datos preparados para exportación PDF'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al exportar PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard statistics.
     */
    public function dashboardStats(): JsonResponse
    {
        try {
            $stats = [
                'total_vehiculos' => Vehicle::count(),
                'vehiculos_activos' => Vehicle::activo()->count(),
                'total_conductores' => Conductor::count(),
                'conductores_activos' => Conductor::activo()->count(),
                'total_propietarios' => Propietario::count(),
                'propietarios_activos' => Propietario::activo()->count(),
                'vehiculos_recientes' => Vehicle::with(['conductor', 'propietario'])
                    ->activo()
                    ->orderBy('fecha_registro', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($vehicle) {
                        return $vehicle->reporte_info;
                    }),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas del dashboard obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas del dashboard: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system alerts.
     */
    public function getAlerts(): JsonResponse
    {
        try {
            $alerts = [];

            // Check for conductors without vehicles
            $conductoresSinVehiculos = Conductor::activo()->doesntHave('vehicles')->count();
            if ($conductoresSinVehiculos > 0) {
                $alerts[] = [
                    'type' => 'warning',
                    'message' => "{$conductoresSinVehiculos} conductor(es) sin vehículos asignados"
                ];
            }

            // Check for propietarios without vehicles
            $propietariosSinVehiculos = Propietario::activo()->doesntHave('vehicles')->count();
            if ($propietariosSinVehiculos > 0) {
                $alerts[] = [
                    'type' => 'info',
                    'message' => "{$propietariosSinVehiculos} propietario(s) sin vehículos registrados"
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $alerts,
                'message' => 'Alertas obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener alertas: ' . $e->getMessage()
            ], 500);
        }
    }
} 