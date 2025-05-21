// src/pages/ParkingPage.jsx
import { useState, useEffect } from 'react';
import {
    getParkingSpots,
    addParkingSpot,
    updateParkingSpot,
    deleteParkingSpot,
    assignVehicle,
    releaseSpot,
} from '../api/parking';
import { getVehicles } from '../api/vehicles';
import ParkingList from '../components/Parking/ParkingList';
import ParkingForm from '../components/Parking/ParkingForm';
import AssignForm from '../components/Parking/AssignForm';
import Pagination from '../components/Pagination'; // Actual working pagination component

const ParkingPage = () => {
    const [spots, setSpots] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(spots.length / recordsPerPage));
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentSpots = spots.slice(indexOfFirstRecord, indexOfLastRecord);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [spotsData, vehiclesData] = await Promise.all([
                getParkingSpots(),
                getVehicles(),
            ]);
            setSpots(spotsData);
            setVehicles(vehiclesData);
            setLoading(false);

            // Ensure current page is valid
            const updatedTotalPages = Math.max(1, Math.ceil(spotsData.length / recordsPerPage));
            if (currentPage > updatedTotalPages) {
                setCurrentPage(1);
            }
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

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Parking Spots</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <ParkingList
                        currentSpots={currentSpots}
                        onToggle={handleToggleStatus}
                        onDelete={handleDeleteSpot}
                        onRelease={handleRelease}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
                <div className="space-y-6">
                    <ParkingForm onSubmit={handleAddSpot} />
                    <AssignForm
                        spots={spots.filter((spot) => !spot.is_occupied)}
                        vehicles={vehicles}
                        onSubmit={handleAssign}
                    />
                </div>
            </div>
        </div>
    );
};

export default ParkingPage;
