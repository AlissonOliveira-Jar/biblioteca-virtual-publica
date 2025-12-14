import { Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import ForbiddenPage from './pages/ForbiddenPage';
import ServerErrorPage from './pages/ServerErrorPage';
import AdminRoute from './components/AdminRoute';
import AdminPage from './pages/AdminPage';
import LibrarianRoute from './components/LibrarianRoute';
import AuthorsListPage from './pages/AuthorsListPage';
import AuthorFormPage from './pages/AuthorFormPage';
import PublishersListPage from './pages/PublishersListPage';
import PublisherFormPage from './pages/PublisherFormPage';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticleFormPage from './pages/ArticleFormPage';
import BooksListPage from './pages/BooksListPage';
import BookFormPage from './pages/BookFormPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import BookDetailPage from './pages/BookDetailPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import PublisherDetailPage from './pages/PublisherDetailPage';
import MyBooksPage from './pages/MyBooksPage';
import BookReaderPage from './pages/BookReaderPage';
import DiscoverBooksPage from './pages/DiscoverBooksPage';
import RankingPage from './pages/RankingPage.tsx';
import AdminReportsPage from "./pages/AdminReportsPage.tsx";
import RecommendationPage from './pages/RecommendationPage.tsx';
import RatingPage from './pages/RatingPage';
import ListRatingPage from './pages/ListRatingPage.tsx';
import ForumHome from './pages/ForumHome';
import CreateTopic from './pages/CreateTopic';
import TopicDetail from "./pages/TopicDetail.tsx";
const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="grow container mx-auto p-4 flex flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* --- Rotas Públicas --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/forbidden" element={<ForbiddenPage />} />
                <Route path="/server-error" element={<ServerErrorPage />} />

        {/* --- Rotas Protegidas (Usuário Logado) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/autores/:id" element={<AuthorDetailPage />} />
          <Route path="/livros/:id" element={<BookDetailPage />} />
          <Route path="/artigos/:id" element={<ArticleDetailPage />} />
          <Route path="/editoras/:id" element={<PublisherDetailPage />} />
          <Route path="/my-books" element={<MyBooksPage />} />
          <Route path="/livros/:id/ler" element={<BookReaderPage />} />
          <Route path="/discover" element={<DiscoverBooksPage />} />
          <Route path="/usuarios-ranking" element={<RankingPage />} />
          <Route path="/recomendacao" element={<RecommendationPage />} />
          <Route path="/avaliacao" element={<ListRatingPage />} />
          <Route path="/livros/:id/avaliacao" element={<RatingPage />} />
          <Route path="/forum" element={<ForumHome />} />
          <Route path="/forum/new" element={<CreateTopic />} />
          <Route path="/forum/topics/:topicId" element={<TopicDetail />} />
        </Route>

        {/* --- Rotas de Admin --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>

        {/* --- Rotas de Bibliotecário (Gerenciamento) --- */}
        <Route element={<LibrarianRoute />}>
          <Route path="/autores" element={<AuthorsListPage />} />
          <Route path="/autores/novo" element={<AuthorFormPage />} />
          <Route path="/autores/editar/:id" element={<AuthorFormPage />} />
          <Route path="/editoras" element={<PublishersListPage />} />
          <Route path="/editoras/novo" element={<PublisherFormPage />} />
          <Route path="/editoras/editar/:id" element={<PublisherFormPage />} />
          <Route path="/artigos" element={<ArticlesListPage />} />
          <Route path="/artigos/novo" element={<ArticleFormPage />} />
          <Route path="/artigos/editar/:id" element={<ArticleFormPage />} />
          <Route path="/livros" element={<BooksListPage />} />
          <Route path="/livros/novo" element={<BookFormPage />} />
          <Route path="/livros/editar/:id" element={<BookFormPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
