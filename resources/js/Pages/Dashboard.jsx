import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    ChartBarIcon,
    UserGroupIcon,
    FireIcon,
    TrophyIcon,
    PlusIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    const { auth } = usePage().props;
    const [stats, setStats] = useState({
        decisions_count: 0,
        votes_count: 0,
        karma: auth.user.karma || 0,
        badge: auth.user.badge || 'Nuevo'
    });
    const [recentDecisions, setRecentDecisions] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch user's recent decisions
            const response = await fetch('/api/my-decisions?page=1');
            const data = await response.json();
            setRecentDecisions(data.data.slice(0, 3));

            // Update stats from user data
            setStats({
                decisions_count: auth.user.decisions_count || 0,
                votes_count: auth.user.votes_count || 0,
                karma: auth.user.karma || 0,
                badge: auth.user.badge || 'Nuevo'
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const getBadgeStyle = (badge) => {
        const styles = {
            'Overthinker': 'bg-purple-100 text-purple-800',
            'Decisivo': 'bg-green-100 text-green-800',
            'Consejero': 'bg-blue-100 text-blue-800',
            'Nuevo': 'bg-gray-100 text-gray-800'
        };
        return styles[badge] || styles['Nuevo'];
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <Link
                        href="/decisions/create"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nueva Decisión
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                ¡Bienvenido, {auth.user.name}!
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Tu badge actual es{' '}
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeStyle(stats.badge)}`}>
                                    {stats.badge}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ChartBarIcon className="h-10 w-10 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.decisions_count}
                                    </p>
                                    <p className="text-sm text-gray-600">Decisiones Creadas</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UserGroupIcon className="h-10 w-10 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.votes_count}
                                    </p>
                                    <p className="text-sm text-gray-600">Votos Realizados</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FireIcon className="h-10 w-10 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.karma}
                                    </p>
                                    <p className="text-sm text-gray-600">Karma</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrophyIcon className="h-10 w-10 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className={`text-lg font-bold rounded-full px-3 py-1 ${getBadgeStyle(stats.badge)}`}>
                                        {stats.badge}
                                    </p>
                                    <p className="text-sm text-gray-600">Badge</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Decisions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Tus Decisiones Recientes
                                </h3>
                                <Link
                                    href="/my-decisions"
                                    className="text-indigo-600 hover:text-indigo-500 text-sm"
                                >
                                    Ver todas →
                                </Link>
                            </div>

                            {recentDecisions.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">
                                        No has creado ninguna decisión aún
                                    </p>
                                    <Link
                                        href="/decisions/create"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Crear tu primera decisión
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentDecisions.map((decision) => (
                                        <Link
                                            key={decision.id}
                                            href={`/decisions/${decision.id}`}
                                            className="block hover:bg-gray-50 rounded-lg p-4 border border-gray-200"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">
                                                        {decision.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {decision.total_votes} votos • {decision.options?.length} opciones
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <ClockIcon className="w-4 h-4 mr-1" />
                                                    {decision.time_remaining}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/decisions"
                            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
                        >
                            <UserGroupIcon className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900">Explorar Decisiones</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Ayuda a otros con tu voto
                            </p>
                        </Link>

                        <Link
                            href="/decisions/create"
                            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
                        >
                            <PlusIcon className="h-12 w-12 text-green-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900">Nueva Decisión</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Pide ayuda a la comunidad
                            </p>
                        </Link>

                        <Link
                            href="/voted-decisions"
                            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
                        >
                            <ChartBarIcon className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900">Tus Votos</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Ve cómo decidieron otros
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}