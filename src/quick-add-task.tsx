import { ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { api } from "./api";

export default function QuickAddTask() {
  const handleSubmit = async (values: any) => {
    try {
      const response = await api.post("/tasks/", values);
      showToast({
        style: Toast.Style.Success,
        title: "Task added",
        message: `Task "${values.title}" has been created`,
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
      <Form.TextField id="title" title="Task Title" placeholder="Follow up with client" />
      <Form.TextField id="description" title="Description" placeholder="Discuss project details" />
      <Form.TextField id="contactId" title="Associated Contact ID" placeholder="contact_123" />
      <Form.TextField id="dealId" title="Associated Deal ID" placeholder="deal_123" />
      <Form.DatePicker id="dueDate" title="Due Date" />
    </Form>
  );
}