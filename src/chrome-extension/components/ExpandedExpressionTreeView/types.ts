type LogicNodeContent = {
  nodeId: string;
  nodeType: "FsLogicBranchNode" | "FsLogicLeafNode" | "FsVirtualRootNode";
  fieldId: string;
  label: string;
};
type RuleConflict = {
  conditionalA: {
    condition: string;
    action: string;
  };
  conditionalB: {
    condition: string;
    action: string;
  };
};

type CircularReferenceNodeContent = LogicNodeContent & {
  nodeType: "FsCircularDependencyNode";
  ruleConflict: RuleConflict;
  sourceFieldId: string;
  sourceNodeId: string;
  targetFieldId: string;
  targetNodeId: string;
};

// type NodeContentType {
//   nodeId: string;
//   nodeType: "FsLogicBranchNode" | "FsLogicLeafNode" | "FsVirtualRootNode" | "FsCircularDependencyNode";
//   nodeContent: CircularReferenceNode | LogicNode
// }

export namespace Types {
  export type Data = {
    name: string;
    value: number;
  };
  export type GraphData = {
    nodeId: string;
    parentId: string;
    nodeContent: LogicNodeContent | CircularReferenceNodeContent;
  };
}
