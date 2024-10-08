import { List, ActionPanel, Action, showToast, Toast, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export function CompaniesList() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/companies");
      setCompanies(response.data.companies);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch companies",
        message: "Please check your API key and try again",
      });
    }
  };

  return (
    <List>
      {companies.map((company) => (
        <List.Item
          key={company.id}
          title={company.name}
          subtitle={company.industry}
          actions={
            <ActionPanel>
              <Action.Push title="View Company" target={<ViewCompany companyId={company.id} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function ViewCompany({ companyId }) {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await api.get(`/companies/${companyId}`);
      setCompany(response.data);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch company details",
        message: "Please check your API key and try again",
      });
    }
  };

  if (!company) {
    return <List.EmptyView title="Loading..." />;
  }

  return (
    <List>
      <List.Item title="Name" subtitle={company.name} />
      <List.Item title="Industry" subtitle={company.industry} />
      <List.Item title="Address" subtitle={company.address} />
      {/* Add more company details as needed */}
    </List>
  );
}