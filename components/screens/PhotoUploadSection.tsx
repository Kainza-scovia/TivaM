'use client';

import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadSectionProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  isLoading?: boolean;
}

export function PhotoUploadSection({ photos, onPhotosChange, isLoading = false }: PhotoUploadSectionProps) {
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

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

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFiles(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    // Limit to 3 photos total
    const remainingSlots = 3 - photos.length;
    if (remainingSlots <= 0) return;

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const startIndex = photos.length + i;
      setUploadingIndex(startIndex);

      // Read file as base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = event.target.result as string;
          const newPhotos = [...photos, base64String];
          onPhotosChange(newPhotos);
          setUploadingIndex(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-lg text-foreground mb-2 flex items-center gap-2">
          📸 {t('upload-photos')}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">{t('max-3-photos')}</p>
      </div>

      {/* Upload Area */}
      {photos.length < 3 && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <Upload className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold text-foreground text-sm">{t('drag-drop')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('photo-guidelines')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            {t('photos')} ({photos.length}/3)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-border group"
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removePhoto(index)}
                  disabled={isLoading || uploadingIndex === index}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-50"
                >
                  {uploadingIndex === index ? (
                    <span className="text-white text-xs">{t('uploading')}</span>
                  ) : (
                    <X className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            ))}

            {/* Add more photos placeholder */}
            {photos.length < 3 && (
              <div className="relative aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center bg-background/50">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <Card className="p-4 bg-secondary/20 border-secondary/30 text-center">
          <p className="text-sm text-muted-foreground">
            {t('photo-guidelines')}
          </p>
        </Card>
      )}
    </div>
  );
}
