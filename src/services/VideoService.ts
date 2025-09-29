import type { IHttpClient } from './HttpClient';
import type { VideoJob, VideoUploadResponse, PaginatedVideoResponse } from '../types';

// Interface for video service following Interface Segregation Principle
export interface IVideoService {
  uploadVideo(file: File): Promise<VideoUploadResponse>;
  getVideoJobs(page: number, limit: number): Promise<PaginatedVideoResponse>;
  downloadVideo(jobRef: string): Promise<Blob>;
  cancelAllRequests(): void;
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

  async getVideoJobs(page: number, limit: number): Promise<PaginatedVideoResponse> {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append('page', page.toString());
      urlParams.append('limit', limit.toString());
      const url = `/api/v1/videos?${urlParams.toString()}`;

      const response = await this.httpClient.get<PaginatedVideoResponse | VideoJob[]>(url);

      if (response && typeof response === 'object' && 'items' in response) {
        return response as PaginatedVideoResponse;
      }

      if (response && typeof response === 'object' && 'data' in response) {
        const oldResponse = response as unknown as { data: VideoJob[], total: number, page: number, limit: number };
        return {
          items: oldResponse.data,
          total: oldResponse.total,
          page: oldResponse.page,
          limit: oldResponse.limit
        };
      }

      if (Array.isArray(response)) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = response.slice(startIndex, endIndex);
        
        return {
          items: paginatedData,
          total: response.length,
          page: page,
          limit: limit
        };
      }

      return {
        items: [],
        total: 0,
        page: page,
        limit: limit
      };
      
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadVideo(jobRef: string): Promise<Blob> {
    try {
      const params = new URLSearchParams({ job_ref: jobRef });
      const response = await this.httpClient.downloadFile(`/api/v1/zip/download?${params.toString()}`);

      /*
        Bloqueio pro CORS - É a solução ideal mas não temos permissão de liberar a url no bucket.
        [
          {
              "AllowedHeaders": [
                  "*"
              ],
              "AllowedMethods": [
                  "GET"
              ],
              "AllowedOrigins": [
                  "https://video-unpack.netlify.app",
                  "http://localhost:5173"
              ],
              "ExposeHeaders": []
          }
        ]
      */
      // const zipFileInfo = await this.httpClient.get<ZipFileInfo>(`/api/v1/zip?${params.toString()}`);
      // const response = await this.httpClient.downloadFile(zipFileInfo.file_url);
 
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  cancelAllRequests(): void {
    this.httpClient.cancelAllRequests();
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('Ocorreu um erro desconhecido no serviço de vídeo');
  }
}