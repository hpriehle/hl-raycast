import { List, ActionPanel, Action, showToast, Toast, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export function CalendarsList() {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const response = await api.get("/calendars");
      setCalendars(response.data.calendars);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch calendars",
        message: "Please check your API key and try again",
      });
    }
  };

  return (
    <List>
      {calendars.map((calendar) => (
        <List.Item
          key={calendar.id}
          title={calendar.name}
          actions={
            <ActionPanel>
              <Action.Push title="View Free Slots" target={<FreeSlots calendarId={calendar.id} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function FreeSlots({ calendarId }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetchFreeSlots();
  }, []);

  const fetchFreeSlots = async () => {
    try {
      const response = await api.get(`/calendars/${calendarId}/free-slots`);
      setSlots(response.data.slots);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch free slots",
        message: "Please check your API key and try again",
      });
    }
  };

  return (
    <List>
      {slots.map((slot, index) => (
        <List.Item
          key={index}
          title={new Date(slot.start).toLocaleString()}
          subtitle={`Duration: ${slot.duration} minutes`}
          actions={
            <ActionPanel>
              <Action.Push title="Schedule Appointment" target={<CreateAppointment slot={slot} calendarId={calendarId} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function CreateAppointment({ slot, calendarId }) {
  const handleSubmit = async (values) => {
    try {
      await api.post("/calendars/events/appointments", {
        ...values,
        calendarId,
        start: slot.start,
        end: slot.end,
      });
      showToast({
        style: Toast.Style.Success,
        title: "Appointment scheduled",
        message: "The appointment has been added to the calendar",
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to schedule appointment",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Schedule Appointment" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" />
      <Form.TextField id="description" title="Description" />
      <Form.TextField id="contactId" title="Contact ID" />
    </Form>
  );
}

export function ViewAppointments() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/calendars/events");
      setEvents(response.data.events);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch events",
        message: "Please check your API key and try again",
      });
    }
  };

  return (
    <List>
      {events.map((event) => (
        <List.Item
          key={event.id}
          title={event.title}
          subtitle={new Date(event.start).toLocaleString()}
          actions={
            <ActionPanel>
              <Action.Push title="View Appointment" target={<ViewAppointment eventId={event.id} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function ViewAppointment({ eventId }) {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      const response = await api.get(`/calendars/events/appointments/${eventId}`);
      setAppointment(response.data);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch appointment details",
        message: "Please check your API key and try again",
      });
    }
  };

  if (!appointment) {
    return <List.EmptyView title="Loading..." />;
  }

  return (
    <List>
      <List.Item title="Title" subtitle={appointment.title} />
      <List.Item title="Description" subtitle={appointment.description} />
      <List.Item title="Start" subtitle={new Date(appointment.start).toLocaleString()} />
      <List.Item title="End" subtitle={new Date(appointment.end).toLocaleString()} />
      {/* Add more appointment details as needed */}
    </List>
  );
}