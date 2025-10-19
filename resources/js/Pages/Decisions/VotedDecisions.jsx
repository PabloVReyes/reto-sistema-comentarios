import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DecisionCard from '@/Components/Decisions/DecisionCard';

export default function VotedDecisions() {
    const [decisions, setDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchVotedDecisions();
    }, [currentPage]);

    const fetchVotedDecisions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/voted-decisions?page=${currentPage}`);
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Decisiones en las que has Votado
                </h2>
            }
        >
            <Head title="Decisiones Votadas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : decisions.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500">No has votado en ninguna decisión aún</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Explora las decisiones de la comunidad y ayuda a otros con tu voto
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow mb-6 p-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-indigo-600">
                                        {decisions.length}
                                    </p>
                                    <p className="text-sm text-gray-600">Decisiones en las que has participado</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {decisions.map((decision) => (
                                    <div key={decision.id} className="relative">
                                        <DecisionCard decision={decision} />
                                        {decision.status === 'decided' && decision.final_option && (
                                            <div className="absolute top-2 right-2 z-10">
                                                <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                                                    {decision.user_vote?.option_id === decision.final_option_id
                                                        ? '✓ Acertaste'
                                                        : 'Decidida'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
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