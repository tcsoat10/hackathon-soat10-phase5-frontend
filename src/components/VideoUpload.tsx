import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { IVideoService } from '../services/VideoService';

interface VideoUploadProps {
  videoService: IVideoService;
  onUploadSuccess?: () => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ videoService, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid video file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      const result = await videoService.uploadVideo(selectedFile);
      toast.success(`Video uploaded successfully! Job ID: ${result.job_ref}`);
      setSelectedFile(null);
      onUploadSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload video';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-lg mx-auto">
      <div
        className={`upload-area relative p-6 ${
          dragActive ? 'active' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Upload className="w-8 h-8 text-green-500" />
              <span className="text-lg font-medium text-gray-900">Arquivo selecionado</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="ml-4 p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="btn-primary w-full flex justify-center"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Arraste seu vídeo aqui ou{' '}
                  <span className="text-blue-600 hover:text-blue-500">selecione</span>
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="video/*"
                  onChange={handleFileInput}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                MP4, AVI, MOV, MKV up to 100MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;