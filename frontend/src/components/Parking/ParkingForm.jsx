import { useState } from 'react';

const ParkingForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        spot_number: '',
        is_occupied: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            spot_number: '',
            is_occupied: false
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Add New Parking Spot</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="spot_number" className="block text-sm font-medium text-gray-700">Spot Number</label>
                    <input
                        type="text"
                        id="spot_number"
                        name="spot_number"
                        value={formData.spot_number}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_occupied"
                        name="is_occupied"
                        checked={formData.is_occupied}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_occupied" className="ml-2 block text-sm text-gray-700">Occupied</label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Add Parking Spot
                </button>
            </form>
        </div>
    );
};

export default ParkingForm;