import { useEffect, useState, useRef } from "react";

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
};

// Obtener iniciales a partir del nombre del usuario
const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const CommentList = ({ decision_id, setTotalComments, totalComments, reloadTrigger }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const containerRef = useRef(null);
    const [error, setError] = useState('')

    // Comentarios en base de datos
    const fetchComments = async (page = 1) => {
        try {
            page === 1 ? setLoading(true) : setLoadingMore(true);
            const response = await fetch(`/api/decisions/${decision_id}/comments?page=${page}`);
            const data = await response.json();

            if (page === 1) {
                setComments(data.data);
                // Envia el total de comentarios almacenados respecto a la decisión
                setTotalComments(data.total);
            } else {
                setComments((prev) => [...prev, ...data.data]);
            }

            setCurrentPage(data.current_page);
            setLastPage(data.last_page);
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Aumentar el scroll y mostrar mas comentarios
    const handleScroll = () => {
        if (!containerRef.current || loadingMore) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10 && currentPage < lastPage) {
            fetchComments(currentPage + 1);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [decision_id, reloadTrigger]);

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center py-4">
                <p className="text-red-500 text-center py-4">{error}</p>;
            </div>
        )
    }

    if (totalComments === 0) {
        return <p className="text-gray-500 text-center py-4">No hay comentarios aún</p>;
    }

    return (
        <div
            className="space-y-4 overflow-auto max-h-[500px]"
            ref={containerRef}
            onScroll={handleScroll}
        >
            {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4 bg-gray-50 rounded-lg p-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                        {comment.user?.avatar || getInitials(comment.user?.name)}
                    </div>

                    <div className="flex-1">
                        {/* Nombre y tiempo */}
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-700">{comment.user?.name || "Usuario"}</span>
                            <span className="text-xs text-gray-400">{timeAgo(comment.created_at)} atrás</span>
                        </div>
                        {/* Comentario */}
                        <p className="text-gray-600 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                </div>
            ))}

            {loadingMore && (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                </div>
            )}
        </div>
    );
};
