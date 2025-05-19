import api from './axios';

export const getParkingSpots = async () => {
    const response = await api.get('/parking/spots');
    return response.data;
};

export const addParkingSpot = async (spotData) => {
    const response = await api.post('/parking/spots', spotData);
    return response.data;
};

export const updateParkingSpot = async (id, spotData) => {
    const response = await api.put(`/parking/spots/${id}`, spotData);
    return response.data;
};

export const deleteParkingSpot = async (id) => {
    const response = await api.delete(`/parking/spots/${id}`);
    return response.data;
};

export const assignVehicle = async (spotId, licensePlate) => {
    const response = await api.post('/parking/assign', { spot_id: spotId, license_plate: licensePlate });
    return response.data;
};

export const releaseSpot = async (spotId) => {
    const response = await api.put(`/parking/release/${spotId}`);
    return response.data;
};