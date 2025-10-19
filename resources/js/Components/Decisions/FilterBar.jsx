export default function FilterBar({ filters, setFilters }) {
    const handleTypeChange = (e) => {
        setFilters({ ...filters, type: e.target.value });
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, filter: e.target.value });
    };

    return (
        <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Decisión
                    </label>
                    <select
                        id="type"
                        value={filters.type}
                        onChange={handleTypeChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="all">Todas</option>
                        <option value="career">Carrera</option>
                        <option value="technical">Técnica</option>
                        <option value="life">Vida</option>
                        <option value="financial">Financiera</option>
                        <option value="startup">Startup</option>
                    </select>
                </div>

                <div className="flex-1">
                    <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Ordenar por
                    </label>
                    <select
                        id="filter"
                        value={filters.filter}
                        onChange={handleFilterChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="recent">Más recientes</option>
                        <option value="most_voted">Más votadas</option>
                        <option value="expiring_soon">Por expirar</option>
                        <option value="no_votes">Sin votos</option>
                    </select>
                </div>
            </div>
        </div>
    );
}