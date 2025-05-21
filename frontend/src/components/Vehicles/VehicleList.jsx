import { useState } from 'react';
import Pagination from '../Pagination';

const VehicleList = ({ vehicles, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    // Calculate pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = vehicles.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(vehicles.length / recordsPerPage);

    return (
        <div>
            <div className="overflow-x-auto">
                {/* Your table with currentRecords instead of vehicles */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentRecords.map(vehicle => (
                            <tr key={vehicle.license_plate}>
                                <td className="px-6 py-4 whitespace-nowrap">{vehicle.license_plate}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{vehicle.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{vehicle.color}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{vehicle.owner_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onDelete(vehicle.license_plate)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default VehicleList;