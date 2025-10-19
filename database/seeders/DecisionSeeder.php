<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Decision;
use App\Models\Option;
use App\Models\Vote;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class DecisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear algunos usuarios de prueba si no existen
        $users = [];

        $testUsers = [
            ['name' => 'Ana García', 'email' => 'ana@test.com'],
            ['name' => 'Carlos Rodríguez', 'email' => 'carlos@test.com'],
            ['name' => 'María López', 'email' => 'maria@test.com'],
            ['name' => 'Juan Martínez', 'email' => 'juan@test.com'],
            ['name' => 'Laura Sánchez', 'email' => 'laura@test.com'],
            ['name' => 'Pedro Gómez', 'email' => 'pedro@test.com'],
            ['name' => 'Sofia Fernández', 'email' => 'sofia@test.com'],
            ['name' => 'Diego Ruiz', 'email' => 'diego@test.com'],
        ];

        foreach ($testUsers as $userData) {
            $users[] = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('password123'),
                    'karma' => rand(0, 500),
                    'badge' => ['Overthinker', 'Decisivo', 'Consejero'][rand(0, 2)]
                ]
            );
        }

        // Cargar el archivo JSON
        $jsonPath = database_path('data/decisions.json');

        // Crear el directorio si no existe
        if (!file_exists(database_path('data'))) {
            mkdir(database_path('data'), 0755, true);
        }

        // Si el archivo no existe, usar datos predefinidos
        if (!file_exists($jsonPath)) {
            $jsonData = $this->getDefaultDecisions();
        } else {
            $jsonData = json_decode(file_get_contents($jsonPath), true);
        }

        foreach ($jsonData['decisions'] as $index => $decisionData) {
            // Seleccionar un usuario aleatorio como autor
            $author = $users[array_rand($users)];

            // Crear la decisión
            $decision = Decision::create([
                'user_id' => $author->id,
                'title' => $decisionData['title'],
                'context' => $decisionData['context'],
                'type' => $decisionData['type'],
                'is_anonymous' => $decisionData['is_anonymous'],
                'status' => 'open',
                'expires_at' => Carbon::now()->addDays($decisionData['days_until_expire']),
            ]);

            // Crear las opciones
            $options = [];
            foreach ($decisionData['options'] as $optionText) {
                $options[] = Option::create([
                    'decision_id' => $decision->id,
                    'text' => $optionText,
                    'votes_count' => 0,
                ]);
            }

            // Añadir votos aleatorios (60-80% de usuarios votan)
            $votingUsers = $users;
            // Remover al autor de los votantes potenciales
            $votingUsers = array_filter($votingUsers, function($user) use ($author) {
                return $user->id !== $author->id;
            });

            // Determinar cuántos usuarios votarán (60-80%)
            $voterCount = rand(
                intval(count($votingUsers) * 0.6),
                intval(count($votingUsers) * 0.8)
            );

            // Seleccionar votantes aleatorios
            $voters = array_rand(array_values($votingUsers), min($voterCount, count($votingUsers)));
            if (!is_array($voters)) {
                $voters = [$voters];
            }

            $comments = [
                'Buena opción, yo haría lo mismo',
                'Difícil decisión, pero creo que esta es la mejor',
                'En mi experiencia, esto funciona mejor',
                'Considera también los pros y contras a largo plazo',
                'Esta opción me parece la más sensata',
                'Yo pasé por algo similar y esto me funcionó',
                null, // Algunos sin comentario
                null,
                null,
            ];

            foreach ($voters as $voterIndex) {
                $voter = array_values($votingUsers)[$voterIndex];
                $selectedOption = $options[array_rand($options)];

                Vote::create([
                    'user_id' => $voter->id,
                    'decision_id' => $decision->id,
                    'option_id' => $selectedOption->id,
                    'comment' => (rand(0, 100) < 30) ? $comments[array_rand($comments)] : null,
                ]);
            }

            // Actualizar contadores de votos
            foreach ($options as $option) {
                $voteCount = Vote::where('option_id', $option->id)->count();
                $option->update(['votes_count' => $voteCount]);
            }

            // Marcar algunas decisiones como decididas (20% de las más antiguas)
            if ($index < 4) {
                $decision->update([
                    'status' => 'decided',
                    'final_option_id' => $options[array_rand($options)]->id,
                ]);
            }

            // Marcar algunas como expiradas (10%)
            if ($index >= 18) {
                $decision->update([
                    'status' => 'expired',
                    'expires_at' => Carbon::now()->subDays(1),
                ]);
            }
        }

        // Actualizar badges de usuarios basado en sus estadísticas
        foreach ($users as $user) {
            $user->updateBadge();
        }

        $this->command->info('✅ Seeded 20 decisions with votes and comments!');
        $this->command->info('📧 Test users created with password: password123');
        $this->command->table(
            ['Email', 'Name', 'Karma', 'Badge'],
            User::whereIn('email', array_column($testUsers, 'email'))
                ->get(['email', 'name', 'karma', 'badge'])
                ->toArray()
        );
    }

    /**
     * Get default decisions data if JSON file doesn't exist
     */
    private function getDefaultDecisions()
    {
        return [
            'decisions' => [
                [
                    'title' => '¿Debería cambiar de trabajo por una oferta con 30% más de salario?',
                    'context' => 'Tengo una oferta de otra empresa con 30% más de salario, pero mi trabajo actual es muy cómodo.',
                    'type' => 'career',
                    'options' => ['Aceptar la nueva oferta', 'Quedarme donde estoy', 'Negociar un aumento'],
                    'is_anonymous' => false,
                    'days_until_expire' => 7
                ],
                // Agregar más si el archivo no existe
            ]
        ];
    }
}