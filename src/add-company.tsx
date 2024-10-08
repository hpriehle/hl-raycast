import { ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { api } from "./api";

export default function AddCompany() {
  const handleSubmit = async (values: any) => {
    try {
      const response = await api.post("/companies/", values);
      showToast({
        style: Toast.Style.Success,
        title: "Company created",
        message: `${values.name} has been added`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to create company",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Company" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Company Name" placeholder="Acme Inc." />
      <Form.TextField id="industry" title="Industry" placeholder="Technology" />
      <Form.TextField id="address" title="Address" placeholder="123 Main St, City, Country" />
    </Form>
  );
}