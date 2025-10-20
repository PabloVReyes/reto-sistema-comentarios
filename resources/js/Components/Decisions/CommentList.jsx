import { useForm } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import Modal from "../Modal";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

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

export const CommentList = ({ decision_id, setTotalComments, totalComments, reloadTrigger, currentUserId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const containerRef = useRef(null);
    const [error, setError] = useState('')
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data, setData, patch, processing, reset, errors } = useForm({
        content: ''
    });

    const { delete: destroy } = useForm({})

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

    const startEdit = (comment) => {
        setEditingCommentId(comment.id)
        setData('content', comment.content)
    }

    const saveEdit = async (commentId) => {
        patch(`/api/comments/${commentId}`, {
            data: { content: data.content },
            onSuccess: () => {
                setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: data.content } : c));
                setEditingCommentId(null);
                reset('content');
            },
            onError: (err) => console.error(err),
            preserveScroll: true
        });
    }

    const confirmDelete = (comment) => {
        setCommentToDelete(comment);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        setShowDeleteModal(false)
        if (!commentToDelete) return;

        destroy(`/api/comments/${commentToDelete.id}`, {
            onSuccess: () => {
                setComments(prev => prev.filter(c => c.id !== commentToDelete.id));
                setTotalComments(prev => prev - 1);
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onError: () => setShowError(true),
            preserveScroll: true
        });
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
            {comments.map((comment, index) => {
                const isLastUserComment = comment.user?.id === currentUserId && index === 0;
                return (
                    <div key={comment.id} className="flex space-x-4 bg-gray-50 rounded-lg p-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                            {comment.user?.avatar || getInitials(comment.user?.name)}
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Nombre y tiempo */}
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-gray-700">{comment.user?.name || "Usuario"}</span>
                                <span className="text-xs text-gray-400">{timeAgo(comment.created_at)} atrás</span>
                            </div>

                            {/* Comentario */}
                            {editingCommentId === comment.id ? (
                                <>
                                    <div className="flex gap-2">
                                        <textarea
                                            className="w-full border rounded-md p-2"
                                            value={data.content}
                                            onChange={(e) => {
                                                const value = e.target.value.slice(0, 1000);
                                                setData('content', value);
                                            }}
                                        />
                                        <button
                                            className="bg-indigo-600 text-white px-2 rounded-md"
                                            onClick={() => saveEdit(comment.id)}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            className="bg-gray-400 text-white px-2 rounded-md"
                                            onClick={() => setEditingCommentId(null)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {data.content.length}/1000
                                    </span>
                                    <div>

                                        {data.content.length < 10 && (
                                            <span className="text-red-500 text-sm">El comentario debe tener al menos 10 caracteres</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-600 whitespace-pre-wrap break-words">{comment.content}</p>
                            )}

                            {
                                isLastUserComment && editingCommentId !== comment.id && (
                                    <div className="flex gap-2">
                                        <button
                                            className="text-sm text-indigo-600 mt-1"
                                            onClick={() => startEdit(comment)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="text-sm text-red-500 mt-1"
                                            onClick={() => confirmDelete(comment)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            })}

            {loadingMore && (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                </div>
            )}

            {/* Modal de confirmación */}
            <Modal show={showDeleteModal} onClose={() => setShowConfirm(false)}>
                <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-4">Confirmar publicación</h3>
                    <p className="mb-6">¿Estas seguro que quieres eliminar este comentario?</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                        >
                            Sí, eliminar
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de éxito */}
            <Modal show={showSuccess} onClose={() => setShowSuccess(false)} closeable={false}>
                <div className="p-6 text-center">
                    <CheckCircleIcon className="mx-auto w-12 h-12 text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold">Comentario eliminado</h3>
                    <p className="mt-2 text-gray-600">Tu comentario se ha eliminado correctamente.</p>
                </div>
            </Modal>

            {/* Modal de error */}
            <Modal show={showError} onClose={() => setError(false)}>
                <div className="p-6 text-center">
                    <ExclamationCircleIcon className="mx-auto w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold">Error al eliminar</h3>
                    <p className="mt-2 text-gray-600">{errorMessage || "No se ha eliminado el comentario"}</p>
                </div>
            </Modal>
        </div>
    );
};
