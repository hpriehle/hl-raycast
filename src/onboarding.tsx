import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { useState } from "react";
import MainView from "./index";

export default function Onboarding() {
  const [hltoken, setHltoken] = useState("");
  const { push } = useNavigation();

  const handleSubmit = (values: { hltoken: string }) => {
    // In a real implementation, you would validate the API token here
    // For now, we'll just assume it's valid and move to the main view
    push(<MainView />);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save API Token" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.PasswordField
        id="hltoken"
        title="API Token"
        placeholder="Enter your HighLevel API token"
        value={hltoken}
        onChange={setHltoken}
      />
    </Form>
  );
}