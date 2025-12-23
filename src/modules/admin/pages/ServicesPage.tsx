import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { Service } from '../../../types';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/16/solid';

interface ServiceFormData {
    name: string;
    description: string;
    category: string;
    price: string;
    currency: string;
    duration: number;
    images: string[];
}

const AdminServicesPage: React.FC = () => {
    const { userProfile } = useAuth();
    const { uploadImage, uploading } = useCloudinaryUpload();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<ServiceFormData>({
        name: '',
        description: '',
        category: '',
        price: '',
        currency: 'RWF',
        duration: 0.5,
        images: [],
    });

    const categories = [
        'Hair Styling', 'Hair Coloring', 'Hair Treatment', 'Nail Care',
        'Manicure', 'Pedicure', 'Facial', 'Massage', 'Eyebrow & Lashes',
        'Makeup', 'Skin Care', 'Braids', 'Dreadlocks', 'Extensions',
    ];

    useEffect(() => {
        fetchServices();
    }, [userProfile?.salonId]);

    const fetchServices = async () => {
        if (!userProfile?.salonId) return;

        try {
            const servicesQuery = query(
                collection(db, 'services'),
                where('salonId', '==', userProfile.salonId)
            );
            const snapshot = await getDocs(servicesQuery);
            const servicesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as Service[];

            setServices(servicesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === 'price') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: Number(value),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const imageUrl = await uploadImage(file, 'salon-services');
            if (imageUrl) {
                setFormData(prev => ({
                    ...prev,
                    images: Array.isArray(prev.images) ? [...prev.images, imageUrl] : [imageUrl],
                }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: Array.isArray(prev.images) ? prev.images.filter((_, i) => i !== index) : [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile?.salonId) return;

        const priceValue = parseFloat(formData.price);
        if (isNaN(priceValue) || priceValue <= 0) {
            alert('Please enter a valid price');
            return;
        }

        try {
            const serviceData = {
                ...formData,
                price: priceValue,
                duration: formData.duration * 60,
                salonId: userProfile.salonId,
                isActive: true,
                updatedAt: new Date(),
            };

            if (editingService) {
                await updateDoc(doc(db, 'services', editingService.id), serviceData);
                setServices(prev =>
                    prev.map(service =>
                        service.id === editingService.id
                            ? { ...service, ...serviceData }
                            : service
                    )
                );
            } else {
                const docRef = await addDoc(collection(db, 'services'), {
                    ...serviceData,
                    createdAt: new Date(),
                });
                setServices(prev => [...prev, {
                    id: docRef.id,
                    ...serviceData,
                    createdAt: new Date(),
                } as Service]);
            }

            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            category: service.category,
            price: service.price.toString(),
            currency: service.currency,
            duration: service.duration / 60,
            images: service.images,
        });
        setShowModal(true);
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            await deleteDoc(doc(db, 'services', serviceId));
            setServices(prev => prev.filter(service => service.id !== serviceId));
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            price: '',
            currency: 'RWF',
            duration: 0.5,
            images: [],
        });
        setEditingService(null);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (loading) {
        return (
            <div className="space-y-3 p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-dark-text">Services</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your salon services
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden"
                    >
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 relative">
                            {service?.images?.[0] ? (
                                <img
                                    src={service.images[0]}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                                </div>
                            )}

                            <div className="absolute top-2 right-2 flex space-x-1">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <PencilIcon className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="p-1.5 bg-white/80 hover:bg-white rounded-full text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <TrashIcon className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-gray-800 dark:text-dark-text text-sm line-clamp-1">
                                    {service.name}
                                </h3>
                                <span className="text-base font-bold text-primary-500 ml-2">
                                    {service.currency} {service.price}
                                </span>
                            </div>

                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {service.description}
                            </p>

                            <div className="flex justify-between items-center text-xs">
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                    {service.category}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {service.duration / 60} hrs
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="col-span-full text-center py-8">
                        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-gray-800 dark:text-dark-text mb-2">
                            No services yet
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Start by adding your first service.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                            <PlusIcon className="w-4 h-4 mr-1" />
                            Add Service
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 p-4 md:items-center">
                    <div className="bg-white dark:bg-dark-card rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text">
                                {editingService ? 'Edit Service' : 'Add Service'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg"
                            >
                                <XMarkIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Service Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-sm"
                                    placeholder="e.g., Hair Cut & Style"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-sm"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-sm resize-none"
                                    placeholder="Describe your service..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Price *
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        required
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Duration (hours)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        min="0.5"
                                        step="0.5"
                                        required
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Service Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400"
                                />

                                {uploading && (
                                    <div className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                                        Uploading...
                                    </div>
                                )}

                                {formData?.images?.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                        {formData?.images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={image}
                                                    alt={`Service ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-dark-border rounded-lg text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    {editingService ? 'Update' : 'Add'} Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServicesPage;