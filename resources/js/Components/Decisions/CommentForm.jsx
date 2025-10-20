import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import Modal from "../Modal"

export const CommentForm = ({ decision_id, onCommentAdded }) => {
    const { data, setData, post, processing, reset, errors, setError, clearErrors } = useForm({
        content: '',
    })
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const value = e.target.value.slice(0, 1000);
        setData('content', value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.content.length < 10) {
            setError('content', 'El comentario debe tener al menos 10 caracteres');
            return;
        }

        clearErrors('content');

        setShowConfirm(true)
    };

    const confirmPublish = () => {
        setShowConfirm(false);

        post(`/api/decisions/${decision_id}/comments`, {
            onSuccess: () => {
                reset('content');
                onCommentAdded?.();

                // Mostrar modal de éxito
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onError: (err) => {

                // Mostrar modal de error
                setErrorMessage(err?.message || 'Error al publicar comentario');
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
            },
            preserveScroll: true
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={2}
                    placeholder="Escribe un comentario..."
                    value={data.content}
                    onChange={handleChange}
                />
                <div className="flex justify-between items-center mt-2">
                    <button
                        type="submit"
                        className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={processing}
                    >
                        {processing ? 'Publicando...' : 'Publicar comentario'}
                    </button>
                    <span className="text-sm text-gray-500">{data.content.length}/1000</span>
                </div>
                {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
            </form>

            {/* Modal de confirmación */}
            <Modal show={showConfirm} onClose={() => setShowConfirm(false)}>
                <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-4">Confirmar publicación</h3>
                    <p className="mb-6">¿Estás seguro de que quieres publicar este comentario?</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={confirmPublish}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Sí, publicar
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
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
                    <h3 className="text-lg font-semibold">Comentario publicado</h3>
                    <p className="mt-2 text-gray-600">Tu comentario se ha publicado correctamente.</p>
                </div>
            </Modal>

            {/* Modal de error */}
            <Modal show={showError} onClose={() => setError(false)}>
                <div className="p-6 text-center">
                    <ExclamationCircleIcon className="mx-auto w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold">Error al eliminar</h3>
                    <p className="mt-2 text-gray-600">{errorMessage}</p>
                </div>
            </Modal>
        </>
    )
}