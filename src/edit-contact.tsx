import { ActionPanel, Action, Form, showToast, Toast, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export default function EditContact() {
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
      await api.put(`/contacts/${selectedContact.id}`, values);
      showToast({
        style: Toast.Style.Success,
        title: "Contact updated",
        message: `${values.firstName} ${values.lastName} has been updated`,
      });
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to update contact",
        message: "Please check your input and try again",
      });
    }
  };

  if (selectedContact) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Update Contact" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField id="firstName" title="First Name" defaultValue={selectedContact.firstName} />
        <Form.TextField id="lastName" title="Last Name" defaultValue={selectedContact.lastName} />
        <Form.TextField id="email" title="Email" defaultValue={selectedContact.email} />
        <Form.TextField id="phone" title="Phone" defaultValue={selectedContact.phone} />
        <Form.TextArea id="notes" title="Notes" defaultValue={selectedContact.notes} />
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