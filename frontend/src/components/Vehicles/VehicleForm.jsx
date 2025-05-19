import { useState } from 'react';

const VehicleForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        license_plate: '',
        model: '',
        color: '',
        owner_email: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            license_plate: '',
            model: '',
            color: '',
            owner_email: ''
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Add New Vehicle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700">License Plate</label>
                    <input
                        type="text"
                        id="license_plate"
                        name="license_plate"
                        value={formData.license_plate}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                    <input
                        type="text"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="owner_email" className="block text-sm font-medium text-gray-700">Owner Email</label>
                    <input
                        type="email"
                        id="owner_email"
                        name="owner_email"
                        value={formData.owner_email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Add Vehicle
                </button>
            </form>
        </div>
    );
};

export default VehicleForm;