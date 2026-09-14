import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../Services/Api";

function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(null);
  const [catalogue, setCatalogue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [itineraryResponse, destinationsResponse] = await Promise.all([
          API.get(`/itineraries/${id}`),
          API.get("/destinations"),
        ]);

        setItinerary(itineraryResponse.data);

        const list = destinationsResponse.data;
        setCatalogue(Array.isArray(list) ? list : list.destinations || []);
      } catch (err) {
        console.error("Itinerary detail error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load this itinerary. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const names = itinerary?.destinations || [];

  const details = names.map(
    (name) =>
      catalogue.find((item) => item.name === name) || { name }
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "35px 20px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            border: "none",
            background: "none",
            color: "#2563eb",
            fontWeight: "600",
            cursor: "pointer",
            padding: 0,
            marginBottom: "18px",
            fontSize: "15px",
          }}
        >
          ← Back to home
        </button>

        {loading && <p>Loading itinerary...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && itinerary && (
          <>
            <section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "28px",
                marginBottom: "25px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
              }}
            >
              <h1
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "27px",
                  color: "#172033",
                }}
              >
                🗺️ {itinerary.title}
              </h1>

              <p style={{ margin: "0 0 6px 0", color: "#4b5563" }}>
                <strong>Duration:</strong> {itinerary.days} day
                {Number(itinerary.days) === 1 ? "" : "s"}
              </p>

              <p style={{ margin: "0 0 6px 0", color: "#4b5563" }}>
                <strong>Stops:</strong> {names.length}
              </p>

              {itinerary.createdAt && (
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                  Created on{" "}
                  {new Date(itinerary.createdAt).toLocaleDateString()}
                </p>
              )}
            </section>

            <h2 style={{ color: "#172033", marginBottom: "16px" }}>
              Destinations on this trip
            </h2>

            {details.length === 0 && <p>No destinations on this itinerary.</p>}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
              }}
            >
              {details.map((destination, index) => (
                <div
                  key={destination.id || destination.name || index}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "18px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        borderRadius: "50%",
                        width: "26px",
                        height: "26px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </span>

                    <h3 style={{ margin: 0, color: "#172033" }}>
                      {destination.name}
                    </h3>
                  </div>

                  {destination.country && (
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        fontWeight: "bold",
                        color: "#374151",
                      }}
                    >
                      {destination.country}
                    </p>
                  )}

                  {destination.category && (
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        color: "#2563eb",
                      }}
                    >
                      <strong>Category:</strong> {destination.category}
                    </p>
                  )}

                  {destination.description && (
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        color: "#4b5563",
                      }}
                    >
                      {destination.description}
                    </p>
                  )}

                  {destination.latitude && destination.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        textAlign: "center",
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        padding: "9px 12px",
                        borderRadius: "7px",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      📍 View on Map
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ItineraryDetail;
