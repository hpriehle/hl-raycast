import { List, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export function ViewPipelines() {
  const [pipelines, setPipelines] = useState([]);

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    try {
      const response = await api.get("/opportunities/pipelines");
      setPipelines(response.data.pipelines);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch pipelines",
        message: "Please check your API key and try again",
      });
    }
  };

  return (
    <List>
      {pipelines.map((pipeline) => (
        <List.Item
          key={pipeline.id}
          title={pipeline.name}
          actions={
            <ActionPanel>
              <Action.Push title="View Stages" target={<ViewPipelineStages pipeline={pipeline} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function ViewPipelineStages({ pipeline }) {
  return (
    <List>
      {pipeline.stages.map((stage) => (
        <List.Item
          key={stage.id}
          title={stage.name}
          subtitle={`${stage.opportunitiesCount} opportunities`}
        />
      ))}
    </List>
  );
}