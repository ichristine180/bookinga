
import { useState } from 'react';
import { Cloudinary } from 'cloudinary-core';

interface UseCloudinaryUploadReturn {
    uploading: boolean;
    error: string | null;
    uploadImage: (file: File, folder: string) => Promise<string | null>;
    deleteImage: (publicId: string) => Promise<void>;
    getOptimizedUrl: (publicId: string, options?: any) => string;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;


    const cloudinary = new Cloudinary({
        cloud_name: cloudName,
        secure: true
    });

    const uploadImage = async (file: File, folder: string): Promise<string | null> => {
        if (!file) {
            setError('No file provided');
            return null;
        }


        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return null;
        }


        if (file.size > 10 * 1024 * 1024) {
            setError('Image size must be less than 10MB');
            return null;
        }

        if (!cloudName || !uploadPreset) {
            setError('Cloudinary configuration missing. Please check your environment variables.');
            return null;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', folder);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `Upload failed with status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.secure_url) {
                throw new Error('No secure URL returned from Cloudinary');
            }

            setUploading(false);
            console.log('Image uploaded successfully:', data.public_id);

            return data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            setError(error instanceof Error ? error.message : 'Failed to upload image');
            setUploading(false);
            return null;
        }
    };

    const deleteImage = async (publicId: string): Promise<void> => {
        if (!publicId) {
            console.warn('No public ID provided for deletion');
            return;
        }

        if (!cloudName || !apiKey || !apiSecret) {
            console.warn('Cloudinary configuration incomplete for deletion');
            return;
        }

        try {




            const response = await fetch('/api/cloudinary/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ publicId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

            console.log('Image deleted successfully:', publicId);
        } catch (error) {
            console.error('Error deleting image:', error);

        }
    };

    const getOptimizedUrl = (publicId: string, options: any = {}): string => {
        if (!publicId || !cloudName) {
            return '';
        }


        const defaultOptions = {
            quality: 'auto',
            fetch_format: 'auto',
            width: 'auto',
            crop: 'scale',
            ...options
        };

        try {
            return cloudinary.url(publicId, defaultOptions);
        } catch (error) {
            console.error('Error generating optimized URL:', error);
            return publicId;
        }
    };

    return {
        uploading,
        error,
        uploadImage,
        deleteImage,
        getOptimizedUrl,
    };
};