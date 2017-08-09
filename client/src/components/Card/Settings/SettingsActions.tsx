import alt, { AbstractActions } from '../../../alt';

interface ISettingsActions {
  openDialog(title: string, elementId: string): IDict<string>;
  closeDialog(): any;
  selectIndex(index: number): number;
  getExportData(dashboard: IDashboardConfig): IDashboardConfig;
  downloadData(): void;
}

class SettingsActions extends AbstractActions implements ISettingsActions {
  constructor(alt: AltJS.Alt) {
    super(alt);
  }

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

}

const settingsActions = alt.createActions<ISettingsActions>(SettingsActions);

export default settingsActions;
