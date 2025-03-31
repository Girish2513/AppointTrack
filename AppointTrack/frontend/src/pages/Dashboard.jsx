import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const [appointments, setAppointments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const response = await axios.get("http://127.0.0.1:8000/api/appointments/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAppointments(response.data);
//       } catch (error) {
//         alert("Session expired, please login again");
//         navigate("/");
//       }
//     };
//     fetchAppointments();
//   }, [navigate]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Your Appointments</h1>
//       <ul>
//         {appointments.map((appt) => (
//           <li key={appt.id} className="p-2 border mb-2">{appt.title} - {appt.date}</li>
//         ))}
//       </ul>
//       <button onClick={() => { localStorage.removeItem("accessToken"); navigate("/"); }}
//         className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
//     </div>
//   );
// }

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [sortOrder, setSortOrder] = useState("date"); // Default sorting by date
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, [sortOrder, filterStatus]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/appointments/`, {
        params: {
          ordering: sortOrder,   // Sorting
          status: filterStatus,  // Filtering
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>

      {/* Filter by Status */}
      <select
        className="border p-2 mb-4"
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
      </select>

      {/* Sort Order */}
      <select
        className="border p-2 ml-4"
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="date">Sort by Date</option>
        <option value="-date">Sort by Date (Descending)</option>
        <option value="created_at">Sort by Created At</option>
      </select>

      {/* Appointment List */}
      <ul className="mt-4">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="border p-4 mb-2 rounded">
            <p>Doctor: {appointment.doctor}</p>
            <p>Date: {appointment.date}</p>
            <p>Status: {appointment.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;