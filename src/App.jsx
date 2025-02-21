import { useState } from "react";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const backendUrl = "http://localhost:5000/bfhl";

  const handleSubmit = async () => {
    setError("");
    setResponseData(null);

    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format. Expected { data: [...] }");
      }

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      const data = await response.json();
      setResponseData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto", backgroundColor: "#f4f4f9", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", color: "black" }}>
      <h2 style={{ textAlign: "center", color: "black" }}>Bajaj Finserv Health Dev Challenge</h2>

      <textarea
        placeholder='Enter JSON (e.g., { "data": ["A", "C", "z"] })'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows="4"
        style={{ width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", backgroundColor: "#fff", color: "black" }}
      />
      <button 
        onClick={handleSubmit} 
        style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Submit
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {responseData && (
        <>
          <h3 style={{ color: "black", marginTop: "20px" }}>Filter Options</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
            <label style={{ backgroundColor: "#007bff", color: "black", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
              <input type="checkbox" value="alphabets" onChange={handleFilterChange} style={{ marginRight: "5px" }} />
              Alphabets
            </label>
            <label style={{ backgroundColor: "#28a745", color: "black", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
              <input type="checkbox" value="numbers" onChange={handleFilterChange} style={{ marginRight: "5px" }} />
              Numbers
            </label>
            <label style={{ backgroundColor: "#dc3545", color: "black", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
              <input type="checkbox" value="highest_alphabet" onChange={handleFilterChange} style={{ marginRight: "5px" }} />
              Highest Alphabet
            </label>
          </div>

          <h3 style={{ color: "black", marginTop: "10px" }}>Response Data</h3>
          <pre style={{ backgroundColor: "#222", color: "#28a745", padding: "10px", borderRadius: "5px", overflowX: "auto" }}>
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(responseData).filter(([key]) => selectedFilters.includes(key))
              ),
              null,
              2
            )}
          </pre>
        </>
      )}
    </div>
  );
}

export default App;
