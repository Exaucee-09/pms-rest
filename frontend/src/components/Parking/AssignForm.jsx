import { useState } from 'react';

const AssignForm = ({ spots, vehicles, onSubmit }) => {
  console.log(spots, "here")
  const [formData, setFormData] = useState({
    spotId: '',
    licensePlate: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData.spotId, formData.licensePlate);
    setFormData({
      spotId: '',
      licensePlate: ''
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-semibold">Assign Vehicle to Spot</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="spotId" className="block text-sm font-medium text-gray-700">
            Parking Spot
          </label>
          <select
            id="spotId"
            name="spotId"
            value={formData.spotId}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Spot</option>
            {spots?.map(spot => (
              <option key={spot.id} value={spot.id}>
                {spot.spot_number} (ID: {spot.id})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
            Vehicle
          </label>
          <select
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Vehicle</option>
            {vehicles?.map(vehicle => (
              <option key={vehicle.license_plate} value={vehicle.license_plate}>
                {vehicle.license_plate} - {vehicle.make} {vehicle.model}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-2 px-4 rounded"
        >
          Assign Vehicle
        </button>
      </form>
    </div>
  );
};

export default AssignForm;