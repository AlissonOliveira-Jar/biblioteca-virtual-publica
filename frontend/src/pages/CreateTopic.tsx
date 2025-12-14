import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import type {ForumCategory} from "../types/forum.ts";
import forumService from "../services/forumService.ts";

const CreateTopic = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isUserBanned = user?.isCommentBanned || false;

    useEffect(() => {
        if (isUserBanned) {
            navigate('/forum');
            return;
        }
        loadCategories();
    }, [isUserBanned]);

    const loadCategories = async () => {
        try {
            const data = await forumService.getCategories();
            setCategories(data);
            if (data.length > 0) {
                setCategoryId(data[0].id);
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || title.length < 5) {
            setError('O título deve ter no mínimo 5 caracteres');
            return;
        }

        if (!content.trim() || content.length < 10) {
            setError('O conteúdo deve ter no mínimo 10 caracteres');
            return;
        }

        if (!categoryId) {
            setError('Selecione uma categoria');
            return;
        }

        setSubmitting(true);
        try {
            const newTopic = await forumService.createTopic({
                title,
                content,
                categoryId,
            });
            navigate(`/forum/topics/${newTopic.id}`);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Erro ao criar tópico');
        } finally {
            setSubmitting(false);
        }
    };

    if (isUserBanned) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <button
                onClick={() => navigate('/forum')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <FaArrowLeft /> Voltar ao Fórum
            </button>

            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600 mb-6">
                    Criar Novo Tópico
                </h1>

                {error && (
                    <div className="bg-red-900/20 border border-red-500 text-red-400 rounded-lg p-4 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Categoria */}
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">
                            Categoria *
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full bg-zinc-900 text-white rounded-lg p-3 border border-zinc-700 focus:border-purple-500 focus:outline-none"
                            disabled={submitting}
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} - {cat.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Título */}
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">
                            Título *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite o título do tópico (mínimo 5 caracteres)"
                            maxLength={255}
                            className="w-full bg-zinc-900 text-white rounded-lg p-3 border border-zinc-700 focus:border-purple-500 focus:outline-none"
                            disabled={submitting}
                        />
                        <p className="text-gray-500 text-sm mt-1">
                            {title.length}/255 caracteres
                        </p>
                    </div>

                    {/* Conteúdo */}
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">
                            Conteúdo *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Descreva seu tópico com detalhes (mínimo 10 caracteres)"
                            className="w-full bg-zinc-900 text-white rounded-lg p-4 border border-zinc-700 focus:border-purple-500 focus:outline-none min-h-[200px] resize-y"
                            disabled={submitting}
                        />
                        <p className="text-gray-500 text-sm mt-1">
                            {content.length} caracteres
                        </p>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/forum')}
                            className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all"
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !title.trim() || !content.trim()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <FaPaperPlane />
                            {submitting ? 'Criando...' : 'Criar Tópico'}
                        </button>
                    </div>
                </form>

                {/* Dicas */}
                <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
                    <h3 className="text-white font-semibold mb-2">💡 Dicas para um bom tópico:</h3>
                    <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                        <li>Escolha um título claro e descritivo</li>
                        <li>Forneça contexto e detalhes relevantes</li>
                        <li>Seja respeitoso e siga as regras da comunidade</li>
                        <li>Revise seu texto antes de publicar</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateTopic;