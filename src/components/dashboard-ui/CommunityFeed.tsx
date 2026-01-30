import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface Destino {
    id: number;
    titulo: string;
}

interface Comment {
    id: number;
    usuario_nombre: string;
    contenido: string;
    fecha_creacion: string;
}

interface Post {
    id: number;
    usuario_nombre: string;
    usuario_email: string;
    titulo: string;
    contenido: string;
    destino_info?: {
        id: number;
        titulo: string;
    };
    comentarios: Comment[];
    total_comentarios: number;
    fecha_creacion: string;
}

const API_BASE = 'http://localhost:8000';

export default function CommunityFeed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [destinos, setDestinos] = useState<Destino[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedPost, setExpandedPost] = useState<number | null>(null);

    // Form states
    const [newPost, setNewPost] = useState({
        titulo: '',
        contenido: '',
        destino: ''
    });

    const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

    const getAuthToken = () => {
        return document.cookie.match(/session_token=([^;]+)/)?.[1];
    };

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE}/api/community/posts/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch destinos for dropdown
    const fetchDestinos = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/destinos/`);
            if (response.ok) {
                const data = await response.json();
                setDestinos(data);
            }
        } catch (error) {
            console.error('Error fetching destinos:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchDestinos();
    }, []);

    // Create new post
    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_BASE}/api/community/posts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    titulo: newPost.titulo,
                    contenido: newPost.contenido,
                    destino: newPost.destino || null
                })
            });

            if (response.ok) {
                setNewPost({ titulo: '', contenido: '', destino: '' });
                setShowCreateModal(false);
                fetchPosts();
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    // Add comment
    const handleAddComment = async (postId: number) => {
        const token = getAuthToken();
        const contenido = newComment[postId];

        if (!contenido?.trim()) return;

        try {
            const response = await fetch(`${API_BASE}/api/community/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    post: postId,
                    contenido: contenido
                })
            });

            if (response.ok) {
                setNewComment({ ...newComment, [postId]: '' });
                fetchPosts();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Comunidad</h1>
                    <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1">
                        Comparte tus experiencias de viaje con otros usuarios
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors w-full sm:w-auto"
                >
                    <Icon icon="lucide:plus" className="w-5 h-5" />
                    <span>Nuevo Post</span>
                </button>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">Crear Post</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 -mr-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            >
                                <Icon icon="lucide:x" className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newPost.titulo}
                                    onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none"
                                    placeholder="Título de tu experiencia"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Destino (opcional)
                                </label>
                                <select
                                    value={newPost.destino}
                                    onChange={(e) => setNewPost({ ...newPost, destino: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none"
                                >
                                    <option value="">Sin destino específico</option>
                                    {destinos.map((destino) => (
                                        <option key={destino.id} value={destino.id}>
                                            {destino.titulo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Contenido
                                </label>
                                <textarea
                                    required
                                    value={newPost.contenido}
                                    onChange={(e) => setNewPost({ ...newPost, contenido: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white resize-none outline-none"
                                    placeholder="Comparte tu experiencia..."
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors font-medium"
                                >
                                    Publicar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                        <Icon icon="lucide:message-circle" className="w-16 h-16 mx-auto text-zinc-400 mb-4" />
                        <p className="text-zinc-600 dark:text-zinc-400">
                            No hay posts aún. ¡Sé el primero en compartir tu experiencia!
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4"
                        >
                            {/* Post Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                                        <Icon icon="lucide:user" className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-900 dark:text-white truncate">
                                            {post.usuario_nombre}
                                        </p>
                                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                                            {formatDate(post.fecha_creacion)}
                                        </p>
                                    </div>
                                </div>
                                {post.destino_info && (
                                    <span className="self-start sm:self-center px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm rounded-full flex items-center gap-1.5 whitespace-nowrap">
                                        <Icon icon="lucide:map-pin" className="w-3.5 h-3.5" />
                                        {post.destino_info.titulo}
                                    </span>
                                )}
                            </div>

                            {/* Post Content */}
                            <div className="space-y-2">
                                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-tight">
                                    {post.titulo}
                                </h3>
                                <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap line-clamp-6">
                                    {post.contenido}
                                </p>
                            </div>

                            {/* Post Actions */}
                            <div className="flex items-center gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                                <button
                                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                                    className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                >
                                    <Icon icon="lucide:message-circle" className="w-5 h-5" />
                                    <span className="text-sm">{post.total_comentarios} comentarios</span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {expandedPost === post.id && (
                                <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                    {/* Comments List */}
                                    {post.comentarios.length > 0 && (
                                        <div className="space-y-3">
                                            {post.comentarios.map((comment) => (
                                                <div key={comment.id} className="flex gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                                                        <Icon icon="lucide:user" className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                                                                {comment.usuario_nombre}
                                                            </p>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                {formatDate(comment.fecha_creacion)}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                                            {comment.contenido}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Comment Form */}
                                    <div className="flex gap-2 sm:gap-3">
                                        <input
                                            type="text"
                                            value={newComment[post.id] || ''}
                                            onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddComment(post.id);
                                                }
                                            }}
                                            placeholder="Escribe un comentario..."
                                            className="flex-1 px-3 sm:px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-sm sm:text-base text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none"
                                        />
                                        <button
                                            onClick={() => handleAddComment(post.id)}
                                            className="px-3 sm:px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shrink-0"
                                        >
                                            <Icon icon="lucide:send" className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
