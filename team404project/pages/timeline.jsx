import { useParams } from "react-router-dom";

export default function CityPage() {
  const { cityName } = useParams();

  return (
    <div className="min-h-screen bg-[#faf9fb] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-6 capitalize">
          {cityName}
        </h1>

        <p className="text-gray-700 text-lg max-w-xl">
          Environmental insights, heat analysis, and green cover data for{" "}
          <span className="font-semibold capitalize">{cityName}</span>.
        </p>
      </div>
    </div>
  );
}
