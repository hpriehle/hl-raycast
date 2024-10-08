import { List, ActionPanel, Action, showToast, Toast, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export function OpportunitiesList() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await api.get("/opportunities/search");
      setOpportunities(response.data.opportunities);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch opportunities",
        message: "Please check your API key and try again",
      });
    }
  };

  return (
    <List>
      {opportunities.map((opportunity) => (
        <List.Item
          key={opportunity.id}
          title={opportunity.name}
          subtitle={`Value: $${opportunity.value}`}
          actions={
            <ActionPanel>
              <Action.Push title="Edit Opportunity" target={<EditOpportunity opportunity={opportunity} />} />
              <Action.Push title="Change Status" target={<ChangeOpportunityStatus opportunityId={opportunity.id} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function EditOpportunity({ opportunity }) {
  const handleSubmit = async (values) => {
    try {
      await api.put(`/opportunities/${opportunity.id}`, values);
      showToast({
        style: Toast.Style.Success,
        title: "Opportunity updated",
        message: `${values.name} has been updated`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to update opportunity",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Update Opportunity" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Name" defaultValue={opportunity.name} />
      <Form.TextField id="value" title="Value" defaultValue={opportunity.value.toString()} />
      {/* Add more fields as needed */}
    </Form>
  );
}

function ChangeOpportunityStatus({ opportunityId }) {
  const handleSubmit = async (values) => {
    try {
      await api.put(`/opportunities/${opportunityId}/status`, { status: values.status });
      showToast({
        style: Toast.Style.Success,
        title: "Status updated",
        message: "Opportunity status has been updated",
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to update status",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Change Status" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="status" title="New Status">
        <Form.Dropdown.Item value="open" title="Open" />
        <Form.Dropdown.Item value="won" title="Won" />
        <Form.Dropdown.Item value="lost" title="Lost" />
      </Form.Dropdown>
    </Form>
  );
}

export function CreateOpportunity() {
  const handleSubmit = async (values) => {
    try {
      await api.post("/opportunities", values);
      showToast({
        style: Toast.Style.Success,
        title: "Opportunity created",
        message: `${values.name} has been added`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to create opportunity",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Opportunity" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Name" />
      <Form.TextField id="value" title="Value" />
      <Form.TextField id="contactId" title="Contact ID" />
      <Form.TextField id="companyId" title="Company ID" />
    </Form>
  );
}