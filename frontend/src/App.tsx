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

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex flex-col">
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/server-error" element={<ServerErrorPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

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
