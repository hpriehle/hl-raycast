import { ActionPanel, Action, Form, showToast, Toast, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export default function TriggerAutomation() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    fetchContacts();
    fetchAutomations();
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

  const fetchAutomations = async () => {
    try {
      const response = await api.get("/automations");
      setAutomations(response.data.automations);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch automations",
        message: "Please check your API key and try again",
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await api.post(`/contacts/${selectedContact.id}/trigger-automation`, { automationId: values.automationId });
      showToast({
        style: Toast.Style.Success,
        title: "Automation triggered",
        message: `Automation has been triggered for ${selectedContact.firstName} ${selectedContact.lastName}`,
      });
      setSelectedContact(null);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to trigger automation",
        message: "Please check your input and try again",
      });
    }
  };

  if (selectedContact) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Trigger Automation" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.Dropdown id="automationId" title="Select Automation">
          {automations.map((automation) => (
            <Form.Dropdown.Item key={automation.id} value={automation.id} title={automation.name} />
          ))}
        </Form.Dropdown>
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