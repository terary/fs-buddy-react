type TLogicTreeDeepStatisticCountField =
  | 'totalBranchNodes'
  // | 'totalCircularExclusiveLogicNodes'
  // | 'totalCircularInclusiveLogicNodes'
  | 'totalCircularLogicNodes'
  | 'totalLeafNodes'
  | 'totalNodes'
  | 'totalRootNodes'
  | 'totalUnclassifiedNodes';

type TLogicTreeDeepStatisticCountRecord = {
  [k in TLogicTreeDeepStatisticCountField]: number;
};

export type {
  TLogicTreeDeepStatisticCountRecord,
  TLogicTreeDeepStatisticCountField,
};
