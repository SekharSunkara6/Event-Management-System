import { useState, useEffect } from "react";
import axios from "axios";
import AdminEventForm from "../../components/AdminEventForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch {
      alert("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch {
      alert("Failed to delete event");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Admin: Manage Events</h1>
      <AdminEventForm
        token={token}
        event={editingEvent}
        onSuccess={() => {
          setEditingEvent(null);
          fetchEvents();
        }}
        onCancel={() => setEditingEvent(null)}
      />
      <div className="mt-6 space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p>{event.date} at {event.time}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setEditingEvent(event)}
                className="px-2 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
