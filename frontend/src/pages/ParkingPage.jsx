import { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { getParkingSpots, addParkingSpot, updateParkingSpot, deleteParkingSpot, assignVehicle, releaseSpot } from '../api/parking';
import { getVehicles } from '../api/vehicles';
import ParkingList from '../components/Parking/ParkingList';
import ParkingForm from '../components/Parking/AssignForm';
import AssignForm from '../components/Parking/AssignForm';

const ParkingPage = () => {
    const [spots, setSpots] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    // const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [spotsData, vehiclesData] = await Promise.all([
                getParkingSpots(),
                getVehicles()
            ]);
            setSpots(spotsData);
            setVehicles(vehiclesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleAddSpot = async (spotData) => {
        try {
            await addParkingSpot(spotData);
            fetchData();
        } catch (error) {
            console.error('Error adding spot:', error);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await updateParkingSpot(id, { is_occupied: !currentStatus });
            fetchData();
        } catch (error) {
            console.error('Error toggling spot status:', error);
        }
    };

    const handleDeleteSpot = async (id) => {
        try {
            await deleteParkingSpot(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting spot:', error);
        }
    };

    const handleAssign = async (spotId, licensePlate) => {
        try {
            await assignVehicle(spotId, licensePlate);
            fetchData();
        } catch (error) {
            console.error('Error assigning vehicle:', error);
        }
    };

    const handleRelease = async (spotId) => {
        try {
            await releaseSpot(spotId);
            fetchData();
        } catch (error) {
            console.error('Error releasing spot:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Parking Spots</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ParkingList
                        spots={spots}
                        onToggle={handleToggleStatus}
                        onDelete={handleDeleteSpot}
                        onRelease={handleRelease}
                    />
                </div>
                <div className="space-y-6">
                    <ParkingForm onSubmit={handleAddSpot} />
                    <AssignForm
                        spots={spots.filter(spot => !spot.is_occupied)}
                        vehicles={vehicles}
                        onSubmit={handleAssign}
                    />
                </div>
            </div>
        </div>
    );
};

export default ParkingPage;