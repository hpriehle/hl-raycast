import { ActionPanel, Action, Form, showToast, Toast, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export default function UpdateDealStage() {
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [pipelineStages, setPipelineStages] = useState([]);

  useEffect(() => {
    fetchDeals();
    fetchPipelineStages();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await api.get("/deals");
      setDeals(response.data.deals);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch deals",
        message: "Please check your API key and try again",
      });
    }
  };

  const fetchPipelineStages = async () => {
    try {
      const response = await api.get("/pipelines");
      setPipelineStages(response.data.stages);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch pipeline stages",
        message: "Please check your API key and try again",
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await api.put(`/deals/${selectedDeal.id}`, { stageId: values.stageId });
      showToast({
        style: Toast.Style.Success,
        title: "Deal stage updated",
        message: `Stage for ${selectedDeal.name} has been updated`,
      });
      setSelectedDeal(null);
      fetchDeals();
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to update deal stage",
        message: "Please check your input and try again",
      });
    }
  };

  if (selectedDeal) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Update Deal Stage" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.Dropdown id="stageId" title="New Stage">
          {pipelineStages.map((stage) => (
            <Form.Dropdown.Item key={stage.id} value={stage.id} title={stage.name} />
          ))}
        </Form.Dropdown>
      </Form>
    );
  }

  return (
    <List onSelectionChange={(id) => setSelectedDeal(deals.find((d) => d.id === id))}>
      {deals.map((deal) => (
        <List.Item
          key={deal.id}
          id={deal.id}
          title={deal.name}
          subtitle={`Stage: ${deal.stageName}`}
        />
      ))}
    </List>
  );
}