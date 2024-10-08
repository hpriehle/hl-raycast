import { List } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export default function VisualizePipeline() {
  const [pipeline, setPipeline] = useState([]);

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    try {
      const response = await api.get("/pipelines");
      setPipeline(response.data.stages);
    } catch (error) {
      console.error("Failed to fetch pipeline:", error);
    }
  };

  return (
    <List>
      {pipeline.map((stage) => (
        <List.Item
          key={stage.id}
          title={stage.name}
          accessories={[{ text: `${stage.dealsCount} deals` }]}
        >
          {stage.deals.map((deal) => (
            <List.Item
              key={deal.id}
              title={deal.name}
              subtitle={`Value: $${deal.value}`}
            />
          ))}
        </List.Item>
      ))}
    </List>
  );
}