// src/components/Parking/ParkingList.jsx
const ParkingList = ({ currentSpots, onToggle, onDelete, onRelease }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Spot Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentSpots.map((spot) => (
                        <tr key={spot.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{spot.spot_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        spot.is_occupied
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}
                                >
                                    {spot.is_occupied ? 'Occupied' : 'Available'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {spot.vehicle_plate || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                <button
                                    onClick={() => onToggle(spot.id, spot.is_occupied)}
                                    className={`px-3 py-1 rounded text-white ${
                                        spot.is_occupied
                                            ? 'bg-yellow-500 hover:bg-yellow-600'
                                            : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                >
                                    {spot.is_occupied ? 'Mark Available' : 'Mark Occupied'}
                                </button>
                                {spot.is_occupied && (
                                    <button
                                        onClick={() => onRelease(spot.id)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Release
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(spot.id)}
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
    );
};

export default ParkingList;
