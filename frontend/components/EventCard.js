export default function EventCard({ event }) {
  return (
    <div className="border rounded p-4 shadow">
      <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover rounded" />
      <h2 className="text-lg font-semibold mt-2">{event.title}</h2>
      <p>{event.description}</p>
      <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
    </div>
  );
}
