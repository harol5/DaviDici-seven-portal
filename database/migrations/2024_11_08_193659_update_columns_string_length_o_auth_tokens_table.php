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
        Schema::table('o_auth_tokens', function (Blueprint $table) {            
            $table->string('access_token',5000)->change();
            $table->string('refresh_token',600)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('o_auth_tokens', function (Blueprint $table) {            
            $table->string('access_token')->change();
            $table->string('refresh_token')->change();
        });
    }
};
