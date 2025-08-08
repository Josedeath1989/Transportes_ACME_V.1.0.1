<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\ConductorController;
use App\Http\Controllers\Api\PropietarioController;
use App\Http\Controllers\Api\ReporteController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Vehicle routes
    Route::prefix('vehicles')->group(function () {
        Route::get('/', [VehicleController::class, 'index']);
        Route::post('/', [VehicleController::class, 'store']);
        Route::get('/{vehicle}', [VehicleController::class, 'show']);
        Route::put('/{vehicle}', [VehicleController::class, 'update']);
        Route::delete('/{vehicle}', [VehicleController::class, 'destroy']);
        Route::get('/conductores/lista', [VehicleController::class, 'getConductores']);
        Route::get('/propietarios/lista', [VehicleController::class, 'getPropietarios']);
        Route::get('/estadisticas', [VehicleController::class, 'getEstadisticas']);
    });

    // Conductor routes
    Route::prefix('conductores')->group(function () {
        Route::get('/', [ConductorController::class, 'index']);
        Route::post('/', [ConductorController::class, 'store']);
        Route::get('/{conductor}', [ConductorController::class, 'show']);
        Route::put('/{conductor}', [ConductorController::class, 'update']);
        Route::delete('/{conductor}', [ConductorController::class, 'destroy']);
        Route::get('/estadisticas', [ConductorController::class, 'getEstadisticas']);
    });

    // Propietario routes
    Route::prefix('propietarios')->group(function () {
        Route::get('/', [PropietarioController::class, 'index']);
        Route::post('/', [PropietarioController::class, 'store']);
        Route::get('/{propietario}', [PropietarioController::class, 'show']);
        Route::put('/{propietario}', [PropietarioController::class, 'update']);
        Route::delete('/{propietario}', [PropietarioController::class, 'destroy']);
        Route::get('/estadisticas', [PropietarioController::class, 'getEstadisticas']);
    });

    // Report routes
    Route::prefix('reportes')->group(function () {
        Route::get('/principal', [ReporteController::class, 'reportePrincipal']);
        Route::get('/conductores', [ReporteController::class, 'reporteConductores']);
        Route::get('/propietarios', [ReporteController::class, 'reportePropietarios']);
        Route::get('/estadisticas', [ReporteController::class, 'estadisticasGenerales']);
        Route::get('/exportar/csv', [ReporteController::class, 'exportarCSV']);
        Route::get('/exportar/pdf', [ReporteController::class, 'exportarPDF']);
    });

    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [ReporteController::class, 'dashboardStats']);
        Route::get('/recent-vehicles', [VehicleController::class, 'recentVehicles']);
        Route::get('/alerts', [ReporteController::class, 'getAlerts']);
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now(),
        'version' => '1.0.0',
        'environment' => config('app.env')
    ]);
}); 