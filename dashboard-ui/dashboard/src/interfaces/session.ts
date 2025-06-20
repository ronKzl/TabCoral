//1 user sessions
export interface session {
  id: string;
  savedAt: string;
  userData: {
    groupInfo: Map<
      BigInt,
      { collapsed: boolean; color: string; title: string }
    >;
    orderedEntries: Array<{
      favicon: string;
      groupId: BigInt;
      index: BigInt;
      title: string;
      url: string;
    }>;
    tabGroups: Map<
      BigInt,
      Array<{ favicon: string; index: BigInt; title: string; url: string }>
    >;
  };
}
//user workflow consists of multiple sessions
export interface workflows {
  workflows: Array<session>;
}
