import type { IHttpClient } from './HttpClient';
import type { VideoJob, VideoUploadResponse } from '../types';

// Interface for video service following Interface Segregation Principle
export interface IVideoService {
  uploadVideo(file: File): Promise<VideoUploadResponse>;
  getVideoJobs(): Promise<VideoJob[]>;
  downloadVideo(jobRef: string): Promise<Blob>;
}

export class VideoService implements IVideoService {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async uploadVideo(file: File): Promise<VideoUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.httpClient.post<VideoUploadResponse>(
        '/api/v1/videos',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVideoJobs(): Promise<VideoJob[]> {
    try {
      const response = await this.httpClient.get<VideoJob[]>('/api/v1/videos');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadVideo(jobRef: string): Promise<Blob> {
    try {
      const params = new URLSearchParams({ job_ref: jobRef });
      const response = await this.httpClient.downloadFile(`/api/v1/zip/download?${params.toString()}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('Ocorreu um erro desconhecido no serviço de vídeo');
  }
}