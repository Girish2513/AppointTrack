


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import dayjs from "dayjs";

// const Dashboard = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [newAppointment, setNewAppointment] = useState({
//     title: "",
//     description: "",
//     date: "",
//     time: "",
//     status: "scheduled",
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [sortOrder, setSortOrder] = useState("date");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [dateRange, setDateRange] = useState("next7days");
//   const [editAppointment, setEditAppointment] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const API_URL = "http://127.0.0.1:8000/api/appointments/";
//   const token = localStorage.getItem("access");

//   useEffect(() => {
//     fetchAppointments();
//   }, [sortOrder, statusFilter, dateRange]);

//   const fetchAppointments = async () => {
//     if (!token) {
//       console.error("❌ No token found, redirecting to login...");
//       window.location.href = "/login";
//       return;
//     }

//     console.log("Fetching appointments with:", {
//       sortOrder,
//       statusFilter,
//       dateRange,
//     });

//     setLoading(true);
//     try {
//       let url = `${API_URL}?ordering=${sortOrder}`;

//       if (statusFilter !== "all") {
//         url += `&status=${statusFilter}`;
//       }

//       if (dateRange === "next7days") {
//         const today = dayjs().format("YYYY-MM-DD");
//         const next7Days = dayjs().add(7, "days").format("YYYY-MM-DD");
//         url += `&date__gte=${today}&date__lte=${next7Days}`;
//       }

//       console.log("API URL:", url);
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       // First improvement: Validate the response data format
//       if (response.data && Array.isArray(response.data)) {
//         setAppointments(response.data);
//         setError("");
//       } else {
//         console.error("Unexpected response format:", response.data);
//         setError("Invalid response format from server");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching appointments:", err);
//       if (err.response && err.response.status === 401) {
//         alert("Session expired! Please log in again.");
//         localStorage.removeItem("access");
//         window.location.href = "/login";
//       } else {
//         // Second improvement: More detailed error reporting
//         const errorMessage = err.response?.data?.detail || "Failed to load appointments. Please check server logs.";
//         setError(errorMessage);
//         console.error("Error details:", err.response?.data);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateAppointment = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       alert("Please log in first.");
//       return;
//     }

//     const appointmentData = {
//       title: newAppointment.title.trim(),
//       description: newAppointment.description || "",
//       date: newAppointment.date,
//       time: newAppointment.time,
//       status: newAppointment.status,
//     };

//     try {
//       await axios.post(API_URL, appointmentData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       toast.success("Appointment Created Successfully!");
//       setNewAppointment({ title: "", description: "", date: "", time: "", status: "scheduled" });
//       fetchAppointments();
//     } catch (err) {
//       toast.error("Failed to create appointment. Check your input.");
//     }
//   };

//   const handleDeleteAppointment = async (id) => {
//     if (!token) {
//       alert("Please log in first.");
//       return;
//     }

//     const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${API_URL}${id}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success(`Appointment ID ${id} deleted`);
//       setAppointments(appointments.filter((appointment) => appointment.id !== id));
//     } catch (err) {
//       toast.error("Failed to delete appointment.");
//     }
//   };

//   const handleEditAppointment = (appointment) => {
//     setEditAppointment(appointment);
//     setShowEditModal(true);
//   };

//   const handleCancelEdit = () => {
//     setEditAppointment(null);
//     setShowEditModal(false);
//   };

//   const handleUpdateAppointment = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       alert("Please log in first.");
//       return;
//     }

//     const updatedAppointment = {
//       title: editAppointment.title.trim(),
//       description: editAppointment.description || "",
//       date: editAppointment.date,
//       time: editAppointment.time,
//       status: editAppointment.status,
//     };

//     try {
//       await axios.put(`${API_URL}${editAppointment.id}/`, updatedAppointment, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       toast.success("Appointment Updated Successfully!");
//       setEditAppointment(null);
//       setShowEditModal(false);
//       fetchAppointments();
//     } catch (err) {
//       toast.error("Failed to update appointment.");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("access");
//     window.location.href = "/login";
//   };

//   const upcomingAppointmentsCount = appointments.filter(appointment =>
//     dayjs(appointment.date).isBefore(dayjs().add(7, 'days')) &&
//     appointment.status === "scheduled"
//   ).length;

//   return (
//     <div className="dashboard" style={styles.dashboard}>
//       {/* Edit Modal */}
//       {showEditModal && (
//         <div style={styles.modalOverlay} className="fade-in">
//           <div style={styles.modalContent} className="scale-in">
//             <div style={styles.modalHeader}>
//               <h3 style={styles.modalTitle}>Edit Appointment</h3>
//               <button 
//                 onClick={handleCancelEdit} 
//                 style={styles.closeButton}
//                 className="button-hover"
//               >
//                 ×
//               </button>
//             </div>
//             <form onSubmit={handleUpdateAppointment} style={styles.form}>
//               <input
//                 type="text"
//                 value={editAppointment.title}
//                 onChange={(e) => setEditAppointment({ ...editAppointment, title: e.target.value })}
//                 style={styles.input}
//                 className="input-hover"
//                 placeholder="Title"
//                 required
//               />
//               <input
//                 type="text"
//                 value={editAppointment.description}
//                 onChange={(e) => setEditAppointment({ ...editAppointment, description: e.target.value })}
//                 style={styles.input}
//                 className="input-hover"
//                 placeholder="Description"
//               />
//               <input
//                 type="date"
//                 value={editAppointment.date}
//                 onChange={(e) => setEditAppointment({ ...editAppointment, date: e.target.value })}
//                 style={styles.input}
//                 className="input-hover"
//                 required
//               />
//               <input
//                 type="time"
//                 value={editAppointment.time}
//                 onChange={(e) => setEditAppointment({ ...editAppointment, time: e.target.value })}
//                 style={styles.input}
//                 className="input-hover"
//                 required
//               />
//               <select 
//                 value={editAppointment.status} 
//                 onChange={(e) => setEditAppointment({ ...editAppointment, status: e.target.value })}
//                 style={styles.input}
//                 className="select-hover"
//                 required
//               >
//                 <option value="scheduled">Scheduled</option>
//                 <option value="completed">Completed</option>
//                 <option value="canceled">Canceled</option>
//               </select>
//               <div style={styles.modalButtonGroup}>
//                 <button 
//                   type="button" 
//                   onClick={handleCancelEdit} 
//                   style={styles.cancelButton} 
//                   className="button-hover"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   style={styles.submitButton} 
//                   className="button-glow"
//                 >
//                   Update Appointment
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div style={styles.content}>
//         <div style={styles.header}>
//           <h2 style={styles.heading}>Appointments Dashboard</h2>
//           <button onClick={handleLogout} style={styles.logoutButton} className="hover-effect">Logout</button>
//         </div>

//         <div style={styles.card} className="fade-in">
//           <div className="filters" style={styles.filters}>
//             <div style={styles.filterGroup}>
//               <label style={styles.label} className="text-hover">Sort By:</label>
//               <select style={styles.select} className="select-hover" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                 <option value="date">Date (Ascending)</option>
//                 <option value="-date">Date (Descending)</option>
//               </select>
//             </div>

//             <div style={styles.filterGroup}>
//               <label style={styles.label} className="text-hover">Filter Status:</label>
//               <select style={styles.select} className="select-hover" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//                 <option value="all">All</option>
//                 <option value="scheduled">Scheduled</option>
//                 <option value="completed">Completed</option>
//                 <option value="canceled">Canceled</option>
//               </select>
//             </div>

//             <div style={styles.filterGroup}>
//               <label style={styles.label} className="text-hover">Date Range:</label>
//               <select style={styles.select} className="select-hover" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
//                 <option value="next7days">Next 7 days</option>
//                 <option value="all">All</option>
//               </select>
//             </div>
//           </div>

//           <div style={styles.summary} className="pulse-effect">
//             <h3>Upcoming Appointments in the Next 7 Days: {upcomingAppointmentsCount}</h3>
//           </div>

//           {loading && <p style={styles.loadingText}>Loading...</p>}
//           {error && <p style={styles.error}>{error}</p>}

//           <ul style={styles.appointmentsList}>
//             {appointments.length > 0 ? (
//               appointments.map((appointment, index) => (
//                 <li key={appointment.id} style={styles.appointmentItem} className="appointment-item-hover scale-in" style={{animationDelay: `${index * 0.1}s`}}>
//                   <h3 style={styles.appointmentTitle} className="title-hover">{appointment.title}</h3>
//                   <p className="text-hover">{appointment.description}</p>
//                   <p className="text-hover">Date: {appointment.date}</p>
//                   <p className="text-hover">Time: {appointment.time}</p>
//                   <p className="text-hover">Status: <span style={{
//                     color: appointment.status === "scheduled" ? "#3b82f6" : 
//                           appointment.status === "completed" ? "#10b981" : "#ef4444",
//                     fontWeight: "bold"
//                   }}>{appointment.status}</span></p>
//                   <div style={styles.buttonGroup}>
//                     <button onClick={() => handleDeleteAppointment(appointment.id)} style={styles.deleteButton} className="button-hover">🗑 Delete</button>
//                     <button onClick={() => handleEditAppointment(appointment)} style={styles.editButton} className="button-hover">✏️ Edit</button>
//                   </div>
//                 </li>
//               ))
//             ) : (
//               !loading && <p style={styles.noAppointments}>No appointments found matching your filters.</p>
//             )}
//           </ul>
//         </div>

//         <div style={styles.card} className="fade-in" style={{animationDelay: "0.3s"}}>
//           <h3 style={styles.cardTitle} className="title-hover">Create Appointment</h3>
//           <form onSubmit={handleCreateAppointment} style={styles.form}>
//             <input
//               type="text"
//               placeholder="Title"
//               value={newAppointment.title}
//               onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
//               required
//               style={styles.input}
//               className="input-hover"
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               value={newAppointment.description}
//               onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
//               style={styles.input}
//               className="input-hover"
//             />
//             <input
//               type="date"
//               value={newAppointment.date}
//               onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
//               required
//               style={styles.input}
//               className="input-hover"
//             />
//             <input
//               type="time"
//               value={newAppointment.time}
//               onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
//               required
//               style={styles.input}
//               className="input-hover"
//             />
//             <button type="submit" style={styles.submitButton} className="button-glow">Create Appointment</button>
//           </form>
//         </div>

//         <ToastContainer />
//       </div>
      
//       {/* CSS for Hover Effects and Animations */}
//       <style>
//         {`
//           /* Fade-in Animation */
//           .fade-in {
//             animation: fadeIn 0.5s ease-in-out;
//           }
          
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
          
//           /* Scale-in Animation */
//           .scale-in {
//             animation: scaleIn 0.3s ease-in-out;
//           }
          
//           @keyframes scaleIn {
//             from { transform: scale(0.95); opacity: 0; }
//             to { transform: scale(1); opacity: 1; }
//           }
          
//           /* Text hover effect */
//           .text-hover {
//             transition: color 0.3s ease;
//           }
          
//           .text-hover:hover {
//             color: #3b82f6;
//           }
          
//           /* Title hover effect */
//           .title-hover {
//             transition: color 0.3s ease, transform 0.2s ease;
//             display: inline-block;
//           }
          
//           .title-hover:hover {
//             color: #3b82f6;
//             transform: translateX(5px);
//           }
          
//           /* Button hover effects */
//           .button-hover {
//             transition: all 0.3s ease;
//           }
          
//           .button-hover:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//           }
          
//           /* Glowing button effect */
//           .button-glow {
//             transition: all 0.3s ease;
//             position: relative;
//             z-index: 1;
//           }
          
//           .button-glow:hover {
//             box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
//             transform: translateY(-2px);
//           }
          
//           .button-glow:active {
//             transform: translateY(0);
//           }
          
//           /* Appointment item hover effect */
//           .appointment-item-hover {
//             transition: all 0.3s ease;
//           }
          
//           .appointment-item-hover:hover {
//             transform: translateY(-3px);
//             box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
//             border-left: 3px solid #3b82f6;
//           }
          
//           /* Input hover effect */
//           .input-hover, .select-hover {
//             transition: all 0.3s ease;
//           }
          
//           .input-hover:hover, .select-hover:hover {
//             border-color: #3b82f6;
//           }
          
//           .input-hover:focus, .select-hover:focus {
//             border-color: #3b82f6;
//             box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
//             outline: none;
//           }
          
//           /* Pulse effect for summary box */
//           .pulse-effect {
//             animation: pulse 2s infinite;
//           }
          
//           @keyframes pulse {
//             0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
//             70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
//             100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
//           }
          
//           /* Hover effect for logout button */
//           .hover-effect {
//             transition: all 0.3s ease;
//           }
          
//           .hover-effect:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// // Updated Styles to match login page and include modal styling
// const styles = {
//   dashboard: {
//     fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
//     background: "linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)",
//     minHeight: "100vh",
//     padding: "20px",
//     color: "#333",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-start",
//   },
//   content: {
//     width: "100%",
//     maxWidth: "900px",
//     margin: "20px auto",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "20px",
//   },
//   heading: {
//     fontSize: "24px",
//     margin: 0,
//     color: "white",
//     fontWeight: "600",
//     textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: "8px",
//     boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
//     padding: "20px",
//     marginBottom: "20px",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease",
//   },
//   cardTitle: {
//     fontSize: "18px",
//     margin: "0 0 15px 0",
//     color: "#3b82f6",
//     fontWeight: "600",
//   },
//   logoutButton: {
//     backgroundColor: "#ef4444",
//     color: "white",
//     padding: "8px 16px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontWeight: "500",
//     fontSize: "14px",
//     transition: "background-color 0.2s",
//   },
//   filters: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "15px",
//     marginBottom: "20px",
//   },
//   filterGroup: {
//     display: "flex",
//     alignItems: "center",
//   },
//   label: {
//     fontWeight: "500",
//     marginRight: "8px",
//     fontSize: "14px",
//     color: "#4b5563",
//   },
//   select: {
//     padding: "8px 12px",
//     borderRadius: "5px",
//     border: "1px solid #e5e7eb",
//     backgroundColor: "#f9fafb",
//     color: "#374151",
//     fontSize: "14px",
//     cursor: "pointer",
//     outline: "none",
//   },
//   summary: {
//     backgroundColor: "#f3f4f6",
//     padding: "12px 15px",
//     borderRadius: "5px",
//     marginBottom: "20px",
//     transition: "all 0.3s ease",
//     border: "1px solid #e5e7eb",
//   },
//   error: {
//     color: "#ef4444",
//     backgroundColor: "#fee2e2",
//     padding: "10px",
//     borderRadius: "5px",
//     marginBottom: "15px",
//     fontSize: "14px",
//   },
//   loadingText: {
//     color: "#6b7280",
//     marginBottom: "15px",
//     fontSize: "14px",
//   },
//   appointmentsList: {
//     listStyle: "none",
//     padding: 0,
//     margin: 0,
//   },
//   appointmentItem: {
//     backgroundColor: "#f9fafb",
//     padding: "15px",
//     marginBottom: "10px",
//     borderRadius: "6px",
//     boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
//     border: "1px solid #e5e7eb",
//     transition: "all 0.3s ease",
//   },
//   appointmentTitle: {
//     margin: "0 0 10px 0",
//     color: "#1f2937",
//   },
//   buttonGroup: {
//     display: "flex",
//     gap: "10px",
//     marginTop: "15px",
//   },
//   deleteButton: {
//     backgroundColor: "#ef4444",
//     color: "white",
//     padding: "6px 12px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "500",
//   },
//   editButton: {
//     backgroundColor: "#3b82f6",
//     color: "white",
//     padding: "6px 12px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "500",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//   },
//   input: {
//     padding: "10px 12px",
//     borderRadius: "5px",
//     border: "1px solid #e5e7eb",
//     fontSize: "14px",
//     color: "#1f2937",
//     backgroundColor: "#f9fafb",
//     outline: "none",
//     transition: "all 0.3s ease",
//   },
//   submitButton: {
//     padding: "10px",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "500",
//     transition: "all 0.3s ease",
//     marginTop: "5px",
//   },
//   // Modal styles
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     backdropFilter: "blur(2px)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderRadius: "8px",
//     boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
//     padding: "25px",
//     width: "90%",
//     maxWidth: "500px",
//     maxHeight: "90vh",
//     overflow: "auto",
//   },
//   modalHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "20px",
//     borderBottom: "1px solid #e5e7eb",
//     paddingBottom: "15px",
//   },
//   modalTitle: {
//     fontSize: "20px",
//     margin: 0,
//     color: "#3b82f6",
//     fontWeight: "600",
//   },
//   closeButton: {
//     backgroundColor: "transparent",
//     border: "none",
//     fontSize: "24px",
//     cursor: "pointer",
//     color: "#6b7280",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "30px",
//     height: "30px",
//     borderRadius: "50%",
//     transition: "all 0.3s ease",
//   },
//   cancelButton: {
//     padding: "10px",
//     backgroundColor: "#6b7280",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "500",
//     transition: "all 0.3s ease",
//   },
//   modalButtonGroup: {
//     display: "flex",
//     justifyContent: "space-between",
//     gap: "15px",
//     marginTop: "10px",
//   },
//   noAppointments: {
//     textAlign: "center",
//     padding: "20px",
//     color: "#6b7280",
//     backgroundColor: "#f9fafb",
//     borderRadius: "5px",
//     border: "1px dashed #e5e7eb",
//   }
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    status: "scheduled",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("date");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("next7days");
  const [editAppointment, setEditAppointment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/appointments/";
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchAppointments();
  }, [sortOrder, statusFilter, dateRange]);

  const fetchAppointments = async () => {
    if (!token) {
      console.error("❌ No token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }

    console.log("Fetching appointments with:", {
      sortOrder,
      statusFilter,
      dateRange,
    });

    setLoading(true);
    try {
      let url = `${API_URL}?ordering=${sortOrder}`;

      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }

      if (dateRange === "next7days") {
        const today = dayjs().format("YYYY-MM-DD");
        const next7Days = dayjs().add(7, "days").format("YYYY-MM-DD");
        url += `&date__gte=${today}&date__lte=${next7Days}`;
      }

      console.log("API URL:", url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // First improvement: Validate the response data format
      if (response.data && Array.isArray(response.data)) {
        setAppointments(response.data);
        setError("");
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired! Please log in again.");
        localStorage.removeItem("access");
        window.location.href = "/login";
      } else {
        // Second improvement: More detailed error reporting
        const errorMessage = err.response?.data?.detail || "Failed to load appointments. Please check server logs.";
        setError(errorMessage);
        console.error("Error details:", err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const appointmentData = {
      title: newAppointment.title.trim(),
      description: newAppointment.description || "",
      date: newAppointment.date,
      time: newAppointment.time,
      status: newAppointment.status,
    };

    try {
      await axios.post(API_URL, appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Appointment Created Successfully!");
      setNewAppointment({ title: "", description: "", date: "", time: "", status: "scheduled" });
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to create appointment. Check your input.");
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`Appointment ID ${id} deleted`);
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (err) {
      toast.error("Failed to delete appointment.");
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditAppointment(appointment);
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setEditAppointment(null);
    setShowEditModal(false);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const updatedAppointment = {
      title: editAppointment.title.trim(),
      description: editAppointment.description || "",
      date: editAppointment.date,
      time: editAppointment.time,
      status: editAppointment.status,
    };

    try {
      await axios.put(`${API_URL}${editAppointment.id}/`, updatedAppointment, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Appointment Updated Successfully!");
      setEditAppointment(null);
      setShowEditModal(false);
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to update appointment.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    window.location.href = "/login";
  };

  const upcomingAppointmentsCount = appointments.filter(appointment =>
    dayjs(appointment.date).isBefore(dayjs().add(7, 'days')) &&
    appointment.status === "scheduled"
  ).length;

  return (
    <div className="dashboard" style={styles.dashboard}>
      {/* Edit Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay} className="fade-in">
          <div style={styles.modalContent} className="scale-in">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Edit Appointment</h3>
              <button 
                onClick={handleCancelEdit} 
                style={styles.closeButton}
                className="button-hover"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateAppointment} style={styles.form}>
              <input
                type="text"
                value={editAppointment.title}
                onChange={(e) => setEditAppointment({ ...editAppointment, title: e.target.value })}
                style={styles.input}
                className="input-hover"
                placeholder="Title"
                required
              />
              <input
                type="text"
                value={editAppointment.description}
                onChange={(e) => setEditAppointment({ ...editAppointment, description: e.target.value })}
                style={styles.input}
                className="input-hover"
                placeholder="Description"
              />
              <input
                type="date"
                value={editAppointment.date}
                onChange={(e) => setEditAppointment({ ...editAppointment, date: e.target.value })}
                style={styles.input}
                className="input-hover"
                required
              />
              <input
                type="time"
                value={editAppointment.time}
                onChange={(e) => setEditAppointment({ ...editAppointment, time: e.target.value })}
                style={styles.input}
                className="input-hover"
                required
              />
              <select 
                value={editAppointment.status} 
                onChange={(e) => setEditAppointment({ ...editAppointment, status: e.target.value })}
                style={styles.input}
                className="select-hover"
                required
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
              <div style={styles.modalButtonGroup}>
                <button 
                  type="button" 
                  onClick={handleCancelEdit} 
                  style={styles.cancelButton} 
                  className="button-hover"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.submitButton} 
                  className="button-glow"
                >
                  Update Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Appointments Dashboard</h2>
          <button onClick={handleLogout} style={styles.logoutButton} className="hover-effect">Logout</button>
        </div>

        <div style={styles.card} className="fade-in">
          <div className="filters" style={styles.filters}>
            <div style={styles.filterGroup}>
              <label style={styles.label} className="text-hover">Sort By:</label>
              <select style={styles.select} className="select-hover" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="date">Date (Ascending)</option>
                <option value="-date">Date (Descending)</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label} className="text-hover">Filter Status:</label>
              <select style={styles.select} className="select-hover" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label} className="text-hover">Date Range:</label>
              <select style={styles.select} className="select-hover" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="next7days">Next 7 days</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>

          <div style={styles.summary} className="pulse-effect">
            <h3>Upcoming Appointments in the Next 7 Days: {upcomingAppointmentsCount}</h3>
          </div>

          {loading && <p style={styles.loadingText}>Loading...</p>}
          {error && <p style={styles.error}>{error}</p>}

          <ul style={styles.appointmentsList}>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <li 
                  key={appointment.id} 
                  style={{
                    ...styles.appointmentItem,
                    border: getAppointmentBorder(appointment.status),
                    animationDelay: `${index * 0.1}s`
                  }} 
                  className="appointment-item-hover scale-in"
                >
                  <h3 style={styles.appointmentTitle} className="title-hover">{appointment.title}</h3>
                  <p className="text-hover">{appointment.description}</p>
                  <p className="text-hover">Date: {appointment.date}</p>
                  <p className="text-hover">Time: {appointment.time}</p>
                  <p className="text-hover">Status: <span style={{
                    color: appointment.status === "scheduled" ? "#3b82f6" : 
                          appointment.status === "completed" ? "#10b981" : "#ef4444",
                    fontWeight: "bold"
                  }}>{appointment.status}</span></p>
                  <div style={styles.buttonGroup}>
                    <button onClick={() => handleDeleteAppointment(appointment.id)} style={styles.deleteButton} className="button-hover">🗑 Delete</button>
                    <button onClick={() => handleEditAppointment(appointment)} style={styles.editButton} className="button-hover">✏️ Edit</button>
                  </div>
                </li>
              ))
            ) : (
              !loading && <p style={styles.noAppointments}>No appointments found matching your filters.</p>
            )}
          </ul>
        </div>

        <div style={styles.card} className="fade-in" style={{animationDelay: "0.3s"}}>
          <h3 style={styles.cardTitle} className="title-hover">Create Appointment</h3>
          <form onSubmit={handleCreateAppointment} style={styles.form}>
            <input
              type="text"
              placeholder="Title"
              value={newAppointment.title}
              onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
              required
              style={styles.input}
              className="input-hover"
            />
            <input
              type="text"
              placeholder="Description"
              value={newAppointment.description}
              onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
              style={styles.input}
              className="input-hover"
            />
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              required
              style={styles.input}
              className="input-hover"
            />
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              required
              style={styles.input}
              className="input-hover"
            />
            <button type="submit" style={styles.submitButton} className="button-glow">Create Appointment</button>
          </form>
        </div>

        <ToastContainer />
      </div>
      
      {/* CSS for Hover Effects and Animations */}
      <style>
        {`
          /* Fade-in Animation */
          .fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Scale-in Animation */
          .scale-in {
            animation: scaleIn 0.3s ease-in-out;
          }
          
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          /* Text hover effect */
          .text-hover {
            transition: color 0.3s ease;
          }
          
          .text-hover:hover {
            color: #3b82f6;
          }
          
          /* Title hover effect */
          .title-hover {
            transition: color 0.3s ease, transform 0.2s ease;
            display: inline-block;
          }
          
          .title-hover:hover {
            color: #3b82f6;
            transform: translateX(5px);
          }
          
          /* Button hover effects */
          .button-hover {
            transition: all 0.3s ease;
          }
          
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          /* Glowing button effect */
          .button-glow {
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
          }
          
          .button-glow:hover {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
            transform: translateY(-2px);
          }
          
          .button-glow:active {
            transform: translateY(0);
          }
          
          /* Appointment item hover effect */
          .appointment-item-hover {
            transition: all 0.3s ease;
          }
          
          .appointment-item-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            border-left: 3px solid #3b82f6;
          }
          
          /* Input hover effect */
          .input-hover, .select-hover {
            transition: all 0.3s ease;
          }
          
          .input-hover:hover, .select-hover:hover {
            border-color: #3b82f6;
          }
          
          .input-hover:focus, .select-hover:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
            outline: none;
          }
          
          /* Pulse effect for summary box */
          .pulse-effect {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          
          /* Hover effect for logout button */
          .hover-effect {
            transition: all 0.3s ease;
          }
          
          .hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
          }
        `}
      </style>
    </div>
  );
};

// Function to get border style based on appointment status
const getAppointmentBorder = (status) => {
  switch (status) {
    case "scheduled":
      return "2px solid #3b82f6"; // Blue border for scheduled
    case "completed":
      return "2px solid #10b981"; // Green border for completed
    case "canceled":
      return "2px solid #ef4444"; // Red border for canceled
    default:
      return "2px solid #e5e7eb"; // Default gray border
  }
};

// Updated Styles to match login page and include modal styling
const styles = {
  dashboard: {
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    background: "linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)",
    minHeight: "100vh",
    padding: "20px",
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  content: {
    width: "100%",
    maxWidth: "900px",
    margin: "20px auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "24px",
    margin: 0,
    color: "white",
    fontWeight: "600",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardTitle: {
    fontSize: "18px",
    margin: "0 0 15px 0",
    color: "#3b82f6",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "20px",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
  },
  label: {
    fontWeight: "500",
    marginRight: "8px",
    fontSize: "14px",
    color: "#4b5563",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    color: "#374151",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },
  summary: {
    backgroundColor: "#f3f4f6",
    padding: "12px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
    transition: "all 0.3s ease",
    border: "1px solid #e5e7eb",
  },
  error: {
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  loadingText: {
    color: "#6b7280",
    marginBottom: "15px",
    fontSize: "14px",
  },
  appointmentsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  appointmentItem: {
    backgroundColor: "#f9fafb",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    borderWidth: "2px",
    borderStyle: "solid",
    transition: "all 0.3s ease",
  },
  appointmentTitle: {
    margin: "0 0 10px 0",
    color: "#1f2937",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#1f2937",
    backgroundColor: "#f9fafb",
    outline: "none",
    transition: "all 0.3s ease",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    marginTop: "5px",
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
    padding: "25px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "15px",
  },
  modalTitle: {
    fontSize: "20px",
    margin: 0,
    color: "#3b82f6",
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6b7280",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  },
  cancelButton: {
    padding: "10px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  modalButtonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "10px",
  },
  noAppointments: {
    textAlign: "center",
    padding: "20px",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px dashed #e5e7eb",
  }
};

export default Dashboard;