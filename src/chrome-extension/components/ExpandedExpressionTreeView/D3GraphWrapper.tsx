import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './D3GraphWrapper.css';

interface D3NodeEnvelopeShape {
  //
  // I had some troubles with d3.stratify and getting the typing correct.
  // This interface is used to override those typings.
  parentId: string;
  nodeId: string;
  nodeContent: any;
  source: {
    x: number;
    y: number;
  };
  target: {
    x: number;
    y: number;
  };
}
interface D3NodeShape {
  // node (circle) on screen
  //
  // I had some troubles with d3.stratify and getting the typing correct.
  // This interface is used to override those typings.
  r: number;
  x: number;
  y: number;
  data: { nodeContent: any };
}
type LabelOptionsType = 'label' | 'fieldId' | 'nodeId' | 'nodeIdExt';
const D3GraphWrapper = (props: IBasicPieChartProps) => {
  useEffect(() => {
    props.data && props.data.length > 0 && draw();
    console.log({
      ExpandedExpressionTreeGraph: { useEffect: { data: props.data } },
    });
  }, [props.data]);

  const effectiveLabel = (nodeContent: any) => {
    const { fieldId, nodeId, label } = nodeContent;

    switch (props.labelBy) {
      case 'fieldId':
        return fieldId;
      case 'nodeId':
        return nodeId;
      case 'nodeIdExt':
        const nodeIdParts = nodeId.split(':');
        return nodeIdParts.length === 1
          ? nodeIdParts[0]
          : nodeIdParts.slice(1).join(':');

      case 'label':
        return label;
    }
  };
  const getSvg = () => {
    const htmlContainer = document.getElementById(
      'expandedExpressionTreeGraph'
    );
    while (htmlContainer && htmlContainer.firstChild) {
      /**
       * For reasons I don't understand, d3 writes the graph twice.
       *  So we remove pre-existing graphs
       */
      htmlContainer.firstChild.remove();
    }

    const svgContainer = d3
      .select('#expandedExpressionTreeGraph')
      .append('svg:svg');
    svgContainer.attr('width', props.width);
    svgContainer.attr('height', props.height);
    svgContainer.attr('border', '1px solid black');
    svgContainer.attr('class', 'svgContainer');
    const svg = svgContainer.append('g');
    svg.attr('transform', 'translate(0, 35)');

    return svg;
  };
  const draw = () => {
    const data: any[] = props.data;
    const pTreeNodeGTreeNodeMap: { [id: string]: any } = {};
    const circularLinks: any[] = [];

    const problemNodes = data.filter(
      (node: any) =>
        !['FsLogicLeafNode', 'FsLogicBranchNode', 'FsVirtualRootNode'].includes(
          node.nodeContent.nodeType
        )
    );

    const treeFactory = d3 //HierarchyLink HierarchyPointNode
      .stratify<D3NodeEnvelopeShape>()
      .id((d) => {
        return d.nodeId;
      })
      .parentId((d) => d.parentId);

    const root = treeFactory(data);

    let treeLayout = d3
      .tree<D3NodeEnvelopeShape>()
      .size([props.width, props.height - 100]);
    treeLayout(root);
    const svg = getSvg();

    // Links
    svg
      .selectAll('line')
      .data(root.links() as unknown as D3NodeEnvelopeShape[])
      .join('line')
      .attr('x1', function (d) {
        return d.source.x;
      })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      });

    // Nodes
    svg
      .selectAll('circle')
      .data(root.descendants() as unknown as D3NodeShape[])
      .join('circle')
      .attr('cx', function (d) {
        const { nodeContent } = d.data;
        pTreeNodeGTreeNodeMap[nodeContent.nodeId + ''] = d;
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .attr('class', (d) => {
        const { nodeContent } = d.data;
        const { operand } = nodeContent;
        console.log({ circle: { operand, nodeContent } });
        if (operand && operand === 'all') {
          return 'blueCircle';
        }
        if (operand && operand === 'any') {
          return 'greenCircle';
        }

        return 'greyCircle';
      })
      .attr('r', 10);

    problemNodes.forEach((pNode: any) => {
      const { sourceNodeId, targetNodeId } = pNode.nodeContent;
      const sourceNode = pTreeNodeGTreeNodeMap[sourceNodeId];
      const targetNode = pTreeNodeGTreeNodeMap[targetNodeId];
      if (sourceNode === undefined || targetNode === undefined) {
        console.log('oops, I did it again.');
      }
      circularLinks.push({
        source: {
          x: sourceNode.x,
          y: sourceNode.y,
        },
        target: {
          x: targetNode.x,
          y: targetNode.y,
        },
      });
    });
    const tmc_note = `
      I think this detects circular references that have exactly the same term - meaning 
      x=y and y=x,  This should not include those circular reference (bring back mutual in/exclusive?)

      Should show only those that are true 'conflict'
`;
    // Circular References
    // the line over the node(circle) appearance is due this being written last.
    // However, this is an overlay of the graph and the node locations
    // are not known until the graph is written.
    svg
      .selectAll('linkCircular')
      .data(circularLinks)
      .join('line')
      .attr('x1', function (d) {
        return d.source.x;
      })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      })
      .attr('z-index', '-1')
      .attr('class', 'linkCircular');

    // Lower Labels
    true &&
      svg
        .selectAll('text.count-label')
        .data(
          root.descendants() as unknown as { x: number; y: number; data: any }[]
        )
        .join('text')
        .call(function (t) {
          t.each(function (d) {
            // for each one
            t.classed('count-label', true);
            var self = d3.select(this);

            const { nodeContent } = d.data;
            self.text(''); // clear it out

            const { operationLabel } = nodeContent;
            [effectiveLabel(nodeContent)]
              .concat(operationLabel)
              .forEach((line: string, index: number) => {
                self
                  .append('tspan') // insert tspans forEach
                  .attr('x', d.x)
                  .attr('y', d.y + (index - 1) * 15)
                  // .attr('y', d.y + (index + 1) * 15)
                  .text(line);
              });
          });
        });
  };

  return (
    <div>
      <div
        id="expandedExpressionTreeGraph"
        className="expandedExpressionTreeGraphContainer"
      />
    </div>
  );
};

interface IBasicPieChartProps {
  width: number;
  height: number;
  labelBy: LabelOptionsType;
  data: any[];
}

export { D3GraphWrapper };
