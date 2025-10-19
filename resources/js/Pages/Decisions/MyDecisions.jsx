import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DecisionCard from '@/Components/Decisions/DecisionCard';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function MyDecisions() {
    const [decisions, setDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMyDecisions();
    }, [currentPage]);

    const fetchMyDecisions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/my-decisions?page=${currentPage}`);
            const data = await response.json();
            setDecisions(data.data);
            setTotalPages(data.last_page);
        } catch (error) {
            console.error('Error fetching decisions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            open: { bg: 'bg-green-100', text: 'text-green-800', label: 'Abierta' },
            decided: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Decidida' },
            expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expirada' },
            archived: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Archivada' }
        };
        const badge = badges[status] || badges.open;
        return <span className={`px-2 py-1 text-xs ${badge.bg} ${badge.text} rounded-full`}>{badge.label}</span>;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Mis Decisiones
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
            <Head title="Mis Decisiones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : decisions.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500 mb-4">No has creado ninguna decisión aún</p>
                            <Link
                                href="/decisions/create"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Crear tu primera decisión
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow mb-6 p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {decisions.reduce((acc, d) => d.status === 'open' ? acc + 1 : acc, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Decisiones Abiertas</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {decisions.reduce((acc, d) => d.status === 'decided' ? acc + 1 : acc, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Decisiones Tomadas</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-600">
                                            {decisions.reduce((acc, d) => acc + d.total_votes, 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Votos Totales</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {decisions.map((decision) => (
                                    <DecisionCard key={decision.id} decision={decision} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-white rounded-md shadow disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <span className="px-4 py-2 bg-white rounded-md shadow">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-white rounded-md shadow disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}