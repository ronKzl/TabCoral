export interface tab {
  favicon: string;
  groupId: number;
  index: number;
  title: string;
  url: string;
}

export interface group {
  collapsed: boolean;
  color: string;
  title: string;
}

export interface session {
  id: string;
  savedAt: string;
  userData: {
    groupInfo: Map<number, group>;
    orderedEntries: Array<tab>;
    tabGroups: Map<number, Array<tab>>;
  };
}

export interface sessions {
  sessions: Array<session>;
}
