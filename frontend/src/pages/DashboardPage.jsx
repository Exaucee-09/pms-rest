const DashboardPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium">Total Parking Spots</h3>
                    <p className="text-3xl font-bold mt-2">24</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium">Occupied Spots</h3>
                    <p className="text-3xl font-bold mt-2">18</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium">Registered Vehicles</h3>
                    <p className="text-3xl font-bold mt-2">42</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;