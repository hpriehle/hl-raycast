import { ActionPanel, Action, Form, showToast, Toast, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export default function ManageTags() {
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
      await api.post(`/contacts/${selectedContact.id}/tags`, { tags: values.tags.split(",") });
      showToast({
        style: Toast.Style.Success,
        title: "Tags updated",
        message: `Tags for ${selectedContact.firstName} ${selectedContact.lastName} have been updated`,
      });
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to update tags",
        message: "Please check your input and try again",
      });
    }
  };

  if (selectedContact) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Update Tags" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="tags"
          title="Tags"
          placeholder="tag1,tag2,tag3"
          defaultValue={selectedContact.tags ? selectedContact.tags.join(",") : ""}
        />
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
          subtitle={contact.tags ? contact.tags.join(", ") : "No tags"}
        />
      ))}
    </List>
  );
}