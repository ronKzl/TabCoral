//1 user sessions
export interface session {
  id: string;
  savedAt: string;
  userData: {
    groupInfo: Map<
      number,
      { collapsed: boolean; color: string; title: string }
    >;
    orderedEntries: Array<{
      favicon: string;
      groupId: number;
      index: number;
      title: string;
      url: string;
    }>;
    tabGroups: Map<
      number,
      Array<{ favicon: string; index: number; title: string; url: string }>
    >;
  };
}
//user sessions consists of multiple session objects
export interface sessions {
  sessions: Array<session>;
}
