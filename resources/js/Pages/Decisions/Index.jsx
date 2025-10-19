import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DecisionCard from '@/Components/Decisions/DecisionCard';
import FilterBar from '@/Components/Decisions/FilterBar';

export default function Index() {
    const [decisions, setDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: 'all',
        filter: 'recent'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchDecisions();
    }, [filters, currentPage]);

    const fetchDecisions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                ...filters
            });
            const response = await fetch(`/api/decisions?${params}`);
            const data = await response.json();
            setDecisions(data.data);
            setTotalPages(data.last_page);
        } catch (error) {
            console.error('Error fetching decisions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Decisiones de la Comunidad
                    </h2>
                    <Link
                        href="/decisions/create"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Nueva Decisión
                    </Link>
                </div>
            }
        >
            <Head title="Decisiones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <FilterBar filters={filters} setFilters={setFilters} />

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : decisions.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500">No hay decisiones disponibles</p>
                        </div>
                    ) : (
                        <>
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