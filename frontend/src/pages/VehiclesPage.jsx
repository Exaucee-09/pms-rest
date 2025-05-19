import { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { getVehicles, addVehicle, deleteVehicle } from '../api/vehicles';
import VehicleList from '../components/Vehicles/VehicleList';
import VehicleForm from '../components/Vehicles/VehicleForm';

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    // const { user } = useAuth();

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setLoading(false);
        }
    };

    const handleAddVehicle = async (vehicleData) => {
        try {
            await addVehicle(vehicleData);
            fetchVehicles();
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const handleDeleteVehicle = async (licensePlate) => {
        try {
            await deleteVehicle(licensePlate);
            fetchVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Vehicles</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <VehicleList
                        vehicles={vehicles}
                        onDelete={handleDeleteVehicle}
                    />
                </div>
                <div>
                    <VehicleForm onSubmit={handleAddVehicle} />
                </div>
            </div>
        </div>
    );
};

export default VehiclesPage;