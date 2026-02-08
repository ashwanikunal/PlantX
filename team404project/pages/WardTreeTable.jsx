import { useEffect, useState } from "react";

export default function WardTreeTable() {
  const [fullData, setFullData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  /* ---------- LOAD GEOJSON ---------- */
  useEffect(() => {
    fetch("/ahmedabad_ward_tree_recommendations.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        const data = geojson.features.map((f) => ({
          ward: f.properties.ward_no,
          area: f.properties.area,
          soil: f.properties.soil_type,
          heat: f.properties.heat_level,
          type: f.properties.tree_type,
          trees: f.properties.recommended_trees.join(", "),
        }));
        setFullData(data);
        setFilteredData(data);
      });
  }, []);

  /* ---------- SEARCH ---------- */
  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = fullData.filter((d) =>
      Object.values(d).join(" ").toLowerCase().includes(q)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, fullData]);

  /* ---------- PAGINATION ---------- */
  const total = filteredData.length;
  const pages = Math.ceil(total / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, total);
  const currentRows = filteredData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-1">
        Choose the right tree species
      </h2>

      <p className="text-gray-600 mb-4">
        Enter your Ward to view tree recommendations based on soil type and heat
        level.
      </p>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by ward number, area, soil type, heat level, or tree name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Ward No</th>
              <th className="p-2">Area</th>
              <th className="p-2">Soil Type</th>
              <th className="p-2">Heat Level</th>
              <th className="p-2">Tree Type</th>
              <th className="p-2">Example Trees</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              currentRows.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">{row.ward}</td>
                  <td className="p-2">{row.area}</td>
                  <td className="p-2">{row.soil}</td>
                  <td className="p-2">{row.heat}</td>
                  <td className="p-2">{row.type}</td>
                  <td className="p-2">{row.trees}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION INFO */}
        <div className="text-sm text-gray-600 mt-3">
          Showing {total === 0 ? 0 : startIndex + 1} to {endIndex} of {total} entries
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(pages)].map((_, i) => {
            const page = i + 1;

            if (
              page === 1 ||
              page === pages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : ""
                  }`}
                >
                  {page}
                </button>
              );
            }

            if (
              (page === currentPage - 2 && page > 1) ||
              (page === currentPage + 2 && page < pages)
            ) {
              return (
                <span key={page} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            return null;
          })}

          <button
            disabled={currentPage === pages || pages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
