<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('placa', 10)->unique();
            $table->string('color', 50);
            $table->string('marca', 100);
            $table->enum('tipo_vehiculo', ['particular', 'publico']);
            $table->foreignId('conductor_id')->constrained('conductores')->onDelete('restrict');
            $table->foreignId('propietario_id')->constrained('propietarios')->onDelete('restrict');
            $table->timestamp('fecha_registro')->useCurrent();
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('marca');
            $table->index('tipo_vehiculo');
            $table->index('estado');
            $table->index('fecha_registro');
            $table->index('conductor_id');
            $table->index('propietario_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
}; 