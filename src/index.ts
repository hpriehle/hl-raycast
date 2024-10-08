import { ActionPanel, Action, Form, showToast, Toast, getPreferenceValues } from "@raycast/api";
import axios from "axios";

interface Preferences {
  apiKey: string;
}

const API_BASE_URL = "https://rest.gohighlevel.com/v1";

const getApiKey = () => {
  const preferences = getPreferenceValues<Preferences>();
  return preferences.apiKey;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  },
});

export default function Command() {
  const handleSubmit = async (values: any) => {
    try {
      const response = await api.post("/contacts/", values);
      showToast({
        style: Toast.Style.Success,
        title: "Contact created",
        message: `${values.firstName} ${values.lastName} has been added`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to create contact",
        message: "Please check your API key and try again",
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
      <Form.TextField id="firstName" title="First Name" placeholder="John" />
      <Form.TextField id="lastName" title="Last Name" placeholder="Doe" />
      <Form.TextField id="email" title="Email" placeholder="john.doe@example.com" />
      <Form.TextField id="phone" title="Phone" placeholder="+1234567890" />
    </Form>
  );
}