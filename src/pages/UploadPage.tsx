import React, { useState } from 'react';
import Layout from '../components/Layout';
import VideoUpload from '../components/VideoUpload';
import VideoList from '../components/VideoList';
import type { IVideoService } from '../services/VideoService';

interface UploadPageProps {
  videoService: IVideoService;
}

const UploadPage: React.FC<UploadPageProps> = ({ videoService }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="space-y-8">
          <div className="text-center animate-slideInUp">
            <h1 className="text-3xl font-bold text-gray-900">Upload Vídeo</h1>
            <p className="mt-2 text-gray-600">
              Faça o upload do seu vídeo para extrair quadros automaticamente
            </p>
          </div>
          
          <div className="card p-6 animate-slideInUp" style={{animationDelay: '0.2s'}}>
            <VideoUpload videoService={videoService} onUploadSuccess={handleUploadSuccess} />
          </div>

          <div className="card p-6 animate-slideInUp" style={{animationDelay: '0.4s'}}>
            <VideoList videoService={videoService} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;