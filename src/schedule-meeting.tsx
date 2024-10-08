import { ActionPanel, Action, Form, showToast, Toast, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export default function ScheduleMeeting() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/contacts");
      setContacts(response.data.contacts);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch contacts",
        message: "Please check your API key and try again",
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await api.post("/appointments", {
        contactId: selectedContact.id,
        ...values,
      });
      showToast({
        style: Toast.Style.Success,
        title: "Meeting scheduled",
        message: `Meeting with ${selectedContact.firstName} ${selectedContact.lastName} has been scheduled`,
      });
      setSelectedContact(null);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to schedule meeting",
        message: "Please check your input and try again",
      });
    }
  };

  if (selectedContact) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Schedule Meeting" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField id="title" title="Meeting Title" placeholder="Project Discussion" />
        <Form.DatePicker id="startDate" title="Start Date and Time" />
        <Form.TextField id="duration" title="Duration (minutes)" placeholder="60" />
        <Form.TextField id="location" title="Location" placeholder="Zoom Meeting" />
        <Form.TextArea id="description" title="Description" placeholder="Discuss project details and next steps" />
      </Form>
    );
  }

  return (
    <List onSelectionChange={(id) => setSelectedContact(contacts.find((c) => c.id === id))}>
      {contacts.map((contact) => (
        <List.Item
          key={contact.id}
          id={contact.id}
          title={`${contact.firstName} ${contact.lastName}`}
          subtitle={contact.email}
        />
      ))}
    </List>
  );
}