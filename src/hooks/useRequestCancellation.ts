import { useEffect } from 'react';
import type { IVideoService } from '../services/VideoService';

interface UseRequestCancellationProps {
  videoService?: IVideoService;
}

export const useRequestCancellation = ({ videoService }: UseRequestCancellationProps) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Cancelar todas as requests quando a página for recarregada
      if (videoService) {
        videoService.cancelAllRequests();
      }
    };

    const handleVisibilityChange = () => {
      // Cancelar requests quando a página ficar oculta (usuário mudou de aba)
      if (document.visibilityState === 'hidden' && videoService) {
        videoService.cancelAllRequests();
      }
    };

    // Event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (videoService) {
        videoService.cancelAllRequests();
      }
    };
  }, [videoService]);

  const cancelAllRequests = () => {
    if (videoService) {
      videoService.cancelAllRequests();
    }
  };

  return { cancelAllRequests };
};