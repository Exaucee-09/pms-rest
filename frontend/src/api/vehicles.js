import api from './axios';

export const getVehicles = async () => {
    const response = await api.get('/vehicles');
    return response.data;
};

export const addVehicle = async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
};

export const deleteVehicle = async (licensePlate) => {
    const response = await api.delete(`/vehicles/${licensePlate}`);
    return response.data;
};