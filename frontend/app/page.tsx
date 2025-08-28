export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Smart Rental Tracker Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome to the Smart Rental Tracker</p>
      <div className="mt-8">
        <a href="/usagelog" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Usage Log
        </a>
      </div>
    </div>
  );
}
