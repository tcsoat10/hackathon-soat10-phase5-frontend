import React, { useState } from 'react';
import Layout from '../components/Layout';
import VideoList from '../components/VideoList';
import type { IVideoService } from '../services/VideoService';

interface DashboardPageProps {
  videoService: IVideoService;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ videoService }) => {
  const [refreshTrigger] = useState(0);

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="card p-8 animate-slideInUp">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitore seus trabalhos de processamento de vídeo e faça download das extrações concluídas.
            </p>
          </div>
          
          <VideoList videoService={videoService} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;