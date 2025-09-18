import { useState, useEffect } from "react";

export default function AdminEventForm({ token, event, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    image_url: "",
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        image_url: event.image_url,
      });
    } else {
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        image_url: "",
      });
    }
  }, [event]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = event ? "put" : "post";
      const url = event
        ? `http://localhost:8000/events/${event.id}`
        : "http://localhost:8000/events";
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      alert(`Event ${event ? "updated" : "created"} successfully`);
      onSuccess();
    } catch {
      alert("Failed to save event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 max-w-lg space-y-4">
      <h2 className="text-lg font-semibold">{event ? "Edit Event" : "Add New Event"}</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        required
        value={form.title}
        onChange={handleChange}
        className="input"
      />
      <textarea
        name="description"
        placeholder="Description"
        required
        value={form.description}
        onChange={handleChange}
        className="input"
        rows={4}
      />
      <input
        type="date"
        name="date"
        required
        value={form.date}
        onChange={handleChange}
        className="input"
      />
      <input
        type="time"
        name="time"
        required
        value={form.time}
        onChange={handleChange}
        className="input"
      />
      <input
        type="text"
        name="image_url"
        placeholder="Image URL"
        required
        value={form.image_url}
        onChange={handleChange}
        className="input"
      />
      <div className="flex space-x-4">
        <button type="submit" className="btn bg-green-600 text-white px-4 py-2 rounded">
          {event ? "Update" : "Add"}
        </button>
        {event && (
          <button
            type="button"
            onClick={onCancel}
            className="btn bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
