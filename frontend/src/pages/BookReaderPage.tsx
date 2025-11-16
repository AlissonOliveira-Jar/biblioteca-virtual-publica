import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import api from '../services/api';
import { FaSpinner, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";


const BookReaderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (!id) {
      toast.error("ID do livro inválido.");
      navigate('/my-books');
      return;
    }

    let objectUrl: string | null = null;
    
    const fetchPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/livros/${id}/visualizar`, {
          responseType: 'blob', 
        });

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        
        objectUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(objectUrl);

      } catch (err) {
        console.error("Erro ao carregar o PDF:", err);
        setError("Não foi possível carregar o livro. O arquivo pode estar faltando ou corrompido.");
        toast.error("Erro ao carregar o livro.");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, navigate]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => 
        numPages ? Math.min(prevPageNumber + 1, numPages) : prevPageNumber
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-900 text-white fixed top-0 left-0 z-50">
      
      {/* --- Cabeçalho/Controles --- */}
      <header className="bg-zinc-800 p-3 flex justify-between items-center shadow-lg shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-purple-400 transition-colors"
        >
          <FaArrowLeft />
          Voltar para a Estante
        </button>

        {/* Controles de Paginação */}
        {numPages && (
          <div className="flex items-center gap-4">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-2 rounded-full bg-zinc-700 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft />
            </button>
            
            <span>
              Página <span className="font-bold">{pageNumber}</span> de <span className="font-bold">{numPages}</span>
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="p-2 rounded-full bg-zinc-700 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        <div className="w-32"></div>
      </header>

      {/* --- Área do Leitor --- */}
      <main className="grow overflow-auto p-4 flex justify-center">
        {loading && (
          <div className="grow flex items-center justify-center">
            <FaSpinner className="animate-spin text-primary text-4xl" />
            <p className="ml-4 text-gray-400">Carregando livro...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-red-400 m-auto">
            <h2 className="text-xl font-bold">Erro ao carregar</h2>
            <p>{error}</p>
          </div>
        )}

        {pdfUrl && !loading && !error && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err: Error) => {
                console.error("React-PDF error:", err);
                setError("Erro ao renderizar o PDF.");
            }}
            loading={
              <div className="grow flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-primary text-4xl" />
              </div>
            }
          >
            {/* Renderiza apenas a página atual */}
            <Page pageNumber={pageNumber} />
          </Document>
        )}
      </main>
    </div>
  );
};

export default BookReaderPage;
