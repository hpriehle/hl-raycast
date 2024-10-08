import { ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { api } from "./api";

export default function AddDeal() {
  const handleSubmit = async (values: any) => {
    try {
      const response = await api.post("/deals/", values);
      showToast({
        style: Toast.Style.Success,
        title: "Deal created",
        message: `${values.name} has been added`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to create deal",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Deal" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Deal Name" placeholder="New Project" />
      <Form.TextField id="value" title="Deal Value" placeholder="10000" />
      <Form.TextField id="contactId" title="Associated Contact ID" placeholder="contact_123" />
      <Form.TextField id="companyId" title="Associated Company ID" placeholder="company_123" />
    </Form>
  );
}