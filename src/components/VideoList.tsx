import React, { useState, useEffect, useCallback } from 'react';
import { Download, RefreshCw, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import type { IVideoService } from '../services/VideoService';
import type { VideoJob } from '../types';

interface VideoListProps {
  videoService: IVideoService;
  refreshTrigger?: number;
}

const VideoList: React.FC<VideoListProps> = ({ videoService, refreshTrigger }) => {
  const [videos, setVideos] = useState<VideoJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingJobs, setDownloadingJobs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const loadVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      const videoJobs = await videoService.getVideoJobs();
      setVideos(videoJobs);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load videos';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [videoService]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos, refreshTrigger]);

  useEffect(() => {
    setCurrentPage(1);
  }, [videos.length]);

  const handleDownload = async (jobRef: string, filename?: string) => {
    setDownloadingJobs(prev => new Set(prev).add(jobRef));
    
    try {
      const blob = await videoService.downloadVideo(jobRef);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename?.split('.').slice(0, -1).join('.') || `video_${jobRef}.zip`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download video';
      toast.error(message);
    } finally {
      setDownloadingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobRef);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-badge status-completed';
      case 'processing':
        return 'status-badge status-processing';
      case 'failed':
        return 'status-badge status-failed';
      case 'pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = videos.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando vídeos...</span>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <p className="text-lg">Ainda não há vídeos enviados</p>
            <p className="text-sm mt-2">Faça o upload do seu primeiro vídeo para começar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Tarefas de processamento de vídeo</h2>
        <button
          onClick={loadVideos}
          disabled={isLoading}
          className="btn-primary flex items-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="card overflow-hidden animate-fadeIn">
        <ul className="divide-y divide-gray-200">
          {currentVideos.map((video) => (
            <li key={video.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          video.status
                        )}`}
                      >
                        {video.status}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Video ID: {video.job_ref}
                      </p>
                      {video.filename && (
                        <p className="text-sm text-gray-500 truncate">
                          File: {video.filename}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{video.client_identification}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Criado em: {formatDate(video.created_at)}</span>
                    </div>
                    {video.updated_at !== video.created_at && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Atualizado em: {formatDate(video.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {video.status.toLowerCase() === 'completed' && (
                    <button
                      onClick={() => handleDownload(video.job_ref, video.filename)}
                      disabled={downloadingJobs.has(video.job_ref)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-flex items-center transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingJobs.has(video.job_ref) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
            <span className="font-medium">{Math.min(endIndex, videos.length)}</span> de{' '}
            <span className="font-medium">{videos.length}</span> resultados
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoList;
