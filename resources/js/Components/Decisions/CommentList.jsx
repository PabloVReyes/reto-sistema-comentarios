import { useEffect, useState } from "react";

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} segundos`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} horas`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} días`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    return `${years} años`;
}

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const CommentList = ({ decision_id, setTotalComments, totalComments, reloadTrigger }) => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLasPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchComments = async (page = 1) => {
        try {
            page === 1 ? setLoading(true) : setLoadingMore(true);
            const response = await fetch(`/api/decisions/${decision_id}/comments?page=${page}`);
            const data = await response.json();

            if (page === 1) {
                setComments(data.data);
                setTotalComments(data.total)
            } else {
                setComments(prev => [...prev, ...data.data])
            }

            setCurrentPage(data.current_page);
            setLasPage(data.lastPage)
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false);
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        fetchComments();
    }, [decision_id, reloadTrigger])

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if (totalComments === 0) {
        return <p className="text-gray-500 text-center py-4">No hay comentarios aún</p>;
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                        {comment.user?.avatar || getInitials(comment.user?.name)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-700">{comment.user?.name || 'Usuario'}</span>
                            <span className="text-xs text-gray-400">{timeAgo(comment.created_at)} atrás</span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                </div>
            ))}

            {currentPage < lastPage && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => fetchComments(currentPage + 1)}
                        disabled={loadingMore}
                        className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingMore ? 'Cargando...' : 'Cargar comentarios anteriores'}
                    </button>
                </div>
            )}
        </div>
    )
}