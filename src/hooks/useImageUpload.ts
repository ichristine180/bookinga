import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { v4 as uuidv4 } from 'uuid';

interface UseImageUploadReturn {
    uploading: boolean;
    error: string | null;
    uploadImage: (file: File, folder: string) => Promise<string | null>;
    deleteImage: (url: string) => Promise<void>;
}

export const useImageUpload = (): UseImageUploadReturn => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File, folder: string): Promise<string | null> => {
        if (!file) return null;


        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return null;
        }


        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return null;
        }

        setUploading(true);
        setError(null);

        try {
            const filename = `${uuidv4()}.${file.name.split('.').pop()}`;
            const storageRef = ref(storage, `${folder}/${filename}`);

            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            setUploading(false);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
            setUploading(false);
            return null;
        }
    };

    const deleteImage = async (url: string): Promise<void> => {
        try {
            const imageRef = ref(storage, url);
            await deleteObject(imageRef);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return {
        uploading,
        error,
        uploadImage,
        deleteImage,
    };
};
