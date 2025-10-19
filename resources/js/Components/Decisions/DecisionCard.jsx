import { Link } from '@inertiajs/react';
import { ClockIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function DecisionCard({ decision }) {
    const getStatusBadge = () => {
        switch (decision.status) {
            case 'open':
                return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Abierta</span>;
            case 'decided':
                return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Decidida</span>;
            case 'expired':
                return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Expirada</span>;
            default:
                return null;
        }
    };

    const getTypeBadge = () => {
        const types = {
            career: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Carrera' },
            technical: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Técnica' },
            life: { bg: 'bg-green-100', text: 'text-green-800', label: 'Vida' },
            financial: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Financiera' },
            startup: { bg: 'bg-red-100', text: 'text-red-800', label: 'Startup' }
        };

        const type = types[decision.type] || types.life;
        return (
            <span className={`px-2 py-1 text-xs ${type.bg} ${type.text} rounded-full`}>
                {type.label}
            </span>
        );
    };

    return (
        <Link href={`/decisions/${decision.id}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full">
                <div className="flex justify-between items-start mb-3">
                    {getTypeBadge()}
                    {getStatusBadge()}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {decision.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {decision.context}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1" />
                            {decision.total_votes} votos
                        </span>
                        <span className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {decision.time_remaining}
                        </span>
                    </div>
                    {decision.user_has_voted && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                </div>

                <div className="mt-4 space-y-2">
                    {decision.options && decision.options.slice(0, 2).map((option) => (
                        <div key={option.id} className="relative">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600 truncate mr-2">{option.text}</span>
                                <span className="text-gray-500">{option.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${option.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {decision.options && decision.options.length > 2 && (
                        <p className="text-xs text-gray-500 text-center">
                            +{decision.options.length - 2} opciones más
                        </p>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Por {decision.is_anonymous ? 'Anónimo' : decision.user?.name}
                    </p>
                </div>
            </div>
        </Link>
    );
}