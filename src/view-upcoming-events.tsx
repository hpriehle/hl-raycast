import { List } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export default function ViewUpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/appointments");
      setEvents(response.data.appointments);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  return (
    <List>
      {events.map((event) => (
        <List.Item
          key={event.id}
          title={event.title}
          subtitle={new Date(event.startDate).toLocaleString()}
          accessories={[{ text: event.duration + " minutes" }]}
        />
      ))}
    </List>
  );
}