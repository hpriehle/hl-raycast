import { List, ActionPanel, Action, getPreferenceValues } from "@raycast/api";
import { ContactsList, CreateContact } from "./contacts";
import { CompaniesList } from "./companies";
import { OpportunitiesList, CreateOpportunity } from "./opportunities";
import { CalendarsList, ViewAppointments } from "./appointments";
import { ViewPipelines } from "./pipelines";
import { MediaLibrary } from "./media-library";
import Onboarding from "./onboarding";

interface Preferences {
  hltoken: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  if (!preferences.hltoken) {
    return <Onboarding />;
  }

  return (
    <List>
      <List.Item
        title="Contacts"
        actions={
          <ActionPanel>
            <Action.Push title="View Contacts" target={<ContactsList />} />
            <Action.Push title="Create Contact" target={<CreateContact />} />
          </ActionPanel>
        }
      />
      <List.Item
        title="Companies"
        actions={
          <ActionPanel>
            <Action.Push title="View Companies" target={<CompaniesList />} />
          </ActionPanel>
        }
      />
      <List.Item
        title="Opportunities"
        actions={
          <ActionPanel>
            <Action.Push title="View Opportunities" target={<OpportunitiesList />} />
            <Action.Push title="Create Opportunity" target={<CreateOpportunity />} />
          </ActionPanel>
        }
      />
      <List.Item
        title="Appointments"
        actions={
          <ActionPanel>
            <Action.Push title="View Calendars" target={<CalendarsList />} />
            <Action.Push title="View Appointments" target={<ViewAppointments />} />
          </ActionPanel>
        }
      />
      <List.Item
        title="Pipelines"
        actions={
          <ActionPanel>
            <Action.Push title="View Pipelines" target={<ViewPipelines />} />
          </ActionPanel>
        }
      />
      <List.Item
        title="Media Library"
        actions={
          <ActionPanel>
            <Action.Push title="View Media Library" target={<MediaLibrary />} />
          </ActionPanel>
        }
      />
    </List>
  );
}