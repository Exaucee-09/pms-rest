// src/components/Pagination.jsx
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center mt-4">
            <nav className="inline-flex shadow-sm">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                {pages.map((number) => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`px-3 py-1 ${
                            number === currentPage
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-black hover:bg-gray-200'
                        }`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
