import alt, { AbstractActions } from '../../../alt';

interface ICardSettingsActions {
  openDialog(title: string, elementId: string): IDict<string>;
  closeDialog(): any;
  selectIndex(index: number): number;
  getExportData(dashboard: IDashboardConfig): IDashboardConfig;
  downloadData(): void;
  setQueryText(query: string): any;
}

class CardSettingsActions extends AbstractActions implements ICardSettingsActions {

  openDialog(title: string, elementId: string) {
    return {title, elementId};
  }

  closeDialog() {
    return {};
  }

  selectIndex(index: number) {
    return index;
  }

  getExportData(dashboard: IDashboardConfig) {
    return dashboard;
  }

  downloadData() {
    return {};
  }

  setQueryText(query: string) {
    return query;
  }
}

const cardSettingsActions = alt.createActions<ICardSettingsActions>(CardSettingsActions);

export default cardSettingsActions;
