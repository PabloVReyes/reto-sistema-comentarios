import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { useForm } from "@inertiajs/react"
import { useRef, useState } from "react"

export const CommentForm = ({ decision_id, onCommentAdded }) => {
    const { data, setData, post, processing, reset, errors, setError, clearErrors } = useForm({
        content: '',
    })
    const [success, setSuccess] = useState(false);
    const timeoutRef = useRef(null);

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

        post(`/api/decisions/${decision_id}/comments`, {
            onSuccess: (content) => {
                reset('content');
                setSuccess(true)
                onCommentAdded?.();

                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                timeoutRef.current = setTimeout(() => {
                    setSuccess(false);
                    timeoutRef.current = null;
                }, 3000);
            },
            onError: (err) => {
                setError(err)
            },
            preserveScroll: true
        });
    };

    return (
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
            {success && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700">Comentario publicado</span>
                </div>
            )}
            {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
        </form>
    )
}