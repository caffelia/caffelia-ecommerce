<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $country = DB::table('countries')->where('code', 'CO')->first();

        if (! $country) {
            return;
        }

        $states = [
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '05', 'default_name' => 'ANTIOQUIA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '08', 'default_name' => 'ATLÁNTICO'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '11', 'default_name' => 'BOGOTÁ, D.C.'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '13', 'default_name' => 'BOLÍVAR'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '15', 'default_name' => 'BOYACÁ'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '17', 'default_name' => 'CALDAS'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '18', 'default_name' => 'CAQUETÁ'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '19', 'default_name' => 'CAUCA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '20', 'default_name' => 'CESAR'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '23', 'default_name' => 'CÓRDOBA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '25', 'default_name' => 'CUNDINAMARCA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '27', 'default_name' => 'CHOCÓ'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '41', 'default_name' => 'HUILA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '44', 'default_name' => 'LA GUAJIRA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '47', 'default_name' => 'MAGDALENA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '50', 'default_name' => 'META'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '52', 'default_name' => 'NARIÑO'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '54', 'default_name' => 'NORTE DE SANTANDER'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '63', 'default_name' => 'QUINDÍO'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '66', 'default_name' => 'RISARALDA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '68', 'default_name' => 'SANTANDER'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '70', 'default_name' => 'SUCRE'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '73', 'default_name' => 'TOLIMA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '76', 'default_name' => 'VALLE DEL CAUCA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '81', 'default_name' => 'ARAUCA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '85', 'default_name' => 'CASANARE'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '86', 'default_name' => 'PUTUMAYO'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '88', 'default_name' => 'ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '91', 'default_name' => 'AMAZONAS'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '94', 'default_name' => 'GUAINÍA'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '95', 'default_name' => 'GUAVIARE'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '97', 'default_name' => 'VAUPÉS'],
            ['country_id' => $country->id, 'country_code' => 'CO', 'code' => '99', 'default_name' => 'VICHADA'],
        ];

        DB::table('country_states')->insert($states);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('country_states')->where('country_code', 'CO')->delete();
    }
};
