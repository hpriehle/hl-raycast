import { List, ActionPanel, Action, showToast, Toast, Form } from "@raycast/api";
import { useState, useEffect } from "react";
import { api } from "./api";

export function MediaLibrary() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/medias/files");
      setFiles(response.data.files);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch files",
        message: "Please check your API key and try again",
      });
    }
  };

  return (
    <List
      actions={
        <ActionPanel>
          <Action.Push title="Upload File" target={<UploadFile onUpload={fetchFiles} />} />
        </ActionPanel>
      }
    >
      {files.map((file) => (
        <List.Item
          key={file.id}
          title={file.name}
          subtitle={file.mimeType}
          accessory={{
            text: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          }}
        />
      ))}
    </List>
  );
}

function UploadFile({ onUpload }) {
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("file", values.file);
      await api.post("/medias/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast({
        style: Toast.Style.Success,
        title: "File uploaded",
        message: "The file has been uploaded to the media library",
      });
      onUpload();
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to upload file",
        message: "Please check your input and try again",
      });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Upload File" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.FilePicker id="file" title="Select File" />
    </Form>
  );
}