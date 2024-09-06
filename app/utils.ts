import { Credential, CredentialGroup } from "./store/appStore";
import { v4 as uuidv4 } from "uuid";
export type Result<T> = {
  data?: T;
  error?: any;
  message?: string;
  statusCode?: number;
};
export function makeResult<T>(result: Result<T>): Result<T> {
  return result;
}

export interface CredentialRawGroupData {
  name: string;
  lastUpdated: string;
  children: Array<CredentialRawData>;
}

export interface CredentialRawData {
  key: string;
  value: string;
  type: "key-value" | "pass-code";
}

export function toExportableJson(data: CredentialGroup[]) {
  let exportData: CredentialRawGroupData[] = data.map((group) => {
    let children = group.children.map((child) => {
      return {
        key: child.key,
        value: child.value,
        type: child.type,
      };
    });
    return {
      name: group.name,
      lastUpdated: new Date().toISOString(),
      children: children,
    };
  });

  return exportData;
}

export function toImportableJson(data: CredentialRawGroupData[]): CredentialGroup[] {
  const importData: CredentialGroup[] = data.map((group) => {
    let children: Credential[] = group.children.map((child) => {
      const childData: Credential = {
        id: uuidv4(),
        key: child.key,
        value: child.value,
        type: child.type,
      };
      return childData;
    });

    let groupData: CredentialGroup = {
      id: uuidv4(),
      name: group.name,
      lastUpdated: group.lastUpdated,
      children: children,
      open: false,
    };

    return groupData;
  });


  return importData;
}
