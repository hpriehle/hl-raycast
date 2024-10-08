import { List, ActionPanel, Action, showToast, Toast, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export function ContactsList() {
  const [contacts, setContacts] = useState([]);

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

  return (
    <List>
      {contacts.map((contact) => (
        <List.Item
          key={contact.id}
          title={`${contact.firstName} ${contact.lastName}`}
          subtitle={contact.email}
          actions={
            <ActionPanel>
              <Action.Push title="Edit Contact" target={<EditContact contact={contact} />} />
              <Action.Push title="Add Tags" target={<AddTags contactId={contact.id} />} />
              <Action.Push title="Add Task" target={<AddTask contactId={contact.id} />} />
              <Action.Push title="Add Note" target={<AddNote contactId={contact.id} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function EditContact({ contact }) {
  const handleSubmit = async (values) => {
    try {
      await api.put(`/contacts/${contact.id}`, values);
      showToast({
        style: Toast.Style.Success,
        title: "Contact updated",
        message: `${values.firstName} ${values.lastName} has been updated`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to update contact",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Update Contact" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="firstName" title="First Name" defaultValue={contact.firstName} />
      <Form.TextField id="lastName" title="Last Name" defaultValue={contact.lastName} />
      <Form.TextField id="email" title="Email" defaultValue={contact.email} />
      <Form.TextField id="phone" title="Phone" defaultValue={contact.phone} />
    </Form>
  );
}

function AddTags({ contactId }) {
  const handleSubmit = async (values) => {
    try {
      await api.post(`/contacts/${contactId}/tags`, { tags: values.tags.split(",") });
      showToast({
        style: Toast.Style.Success,
        title: "Tags added",
        message: "Tags have been added to the contact",
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to add tags",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Tags" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="tags" title="Tags" placeholder="tag1,tag2,tag3" />
    </Form>
  );
}

function AddTask({ contactId }) {
  const handleSubmit = async (values) => {
    try {
      await api.post(`/contacts/${contactId}/tasks`, values);
      showToast({
        style: Toast.Style.Success,
        title: "Task added",
        message: "Task has been added to the contact",
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to add task",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Task" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Task Title" />
      <Form.TextArea id="description" title="Description" />
      <Form.DatePicker id="dueDate" title="Due Date" />
    </Form>
  );
}

function AddNote({ contactId }) {
  const handleSubmit = async (values) => {
    try {
      await api.post(`/contacts/${contactId}/notes`, values);
      showToast({
        style: Toast.Style.Success,
        title: "Note added",
        message: "Note has been added to the contact",
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to add note",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Note" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="content" title="Note Content" />
    </Form>
  );
}

export function CreateContact() {
  const handleSubmit = async (values) => {
    try {
      await api.post("/contacts", values);
      showToast({
        style: Toast.Style.Success,
        title: "Contact created",
        message: `${values.firstName} ${values.lastName} has been added`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to create contact",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Contact" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="firstName" title="First Name" />
      <Form.TextField id="lastName" title="Last Name" />
      <Form.TextField id="email" title="Email" />
      <Form.TextField id="phone" title="Phone" />
    </Form>
  );
}