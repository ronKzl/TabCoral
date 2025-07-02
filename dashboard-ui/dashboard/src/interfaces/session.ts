export interface tab {
  favicon: string;
  groupId: number;
  index: number;
  title: string;
  url: string;
  id: number;
}

export interface group {
  collapsed: boolean;
  color: "grey" | "blue" | "cyan" | "green" | "orange" | "pink" | "purple" | "red" | "yellow";
  title: string;
}

export interface session {
  id: string;
  savedAt: string;
  userData: {
    groupInfo: Record<number, group>;
    orderedEntries: Array<tab>;
    tabGroups: Record<number, Array<tab>>;
  };
}

export interface sessions {
  sessions: Array<session>;
}
