import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './ExpandedExpressionTreeGraph.css';

// const width = 700;
// const height = 500;

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

const ExpandedExpressionTreeGraph = (props: IBasicPieChartProps) => {
  useEffect(() => {
    props.data && props.data.length > 0 && draw();
  }, [props.data]);

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
    // (data: any) => {
    const pTreeNodeGTreeNodeMap: { [id: string]: any } = {};
    const circularLinks: any[] = [];

    const problemNodes = data.filter(
      (node: any) =>
        !['FsLogicLeafNode', 'FsLogicBranchNode', 'FsVirtualRootNode'].includes(
          node.nodeContent.nodeType
        )
    );

    // const simpleNodes = data.filter((node: any) =>
    //   ["FsLogicLeafNode", "FsLogicBranchNode", "FsVirtualRootNode"].includes(
    //     node.nodeContent.nodeType
    //   )
    // );

    const treeFactory = d3 //HierarchyLink HierarchyPointNode
      .stratify<D3NodeEnvelopeShape>()
      .id((d) => {
        console.log({ treeFactoryD: d });
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
      x=y and y=x,  This should not include those circular referene (bring back mutual in/exclusive?)

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

    // Upper Labels
    svg
      .selectAll('text.label')
      .data(
        root.descendants() as unknown as { x: number; y: number; data: any }[]
      )
      .join('text')
      .classed('label', true)
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y - 15;
      })
      .text(function (d) {
        console.log({ nodeLabelsD: d });
        if (!['FsLogicLeafNode'].includes(d.data.nodeContent.nodeType)) {
          const nodeIdElements = d.data.nodeId.split(':').slice(1).join(':');
          return `(${nodeIdElements || d.data.nodeId})`;
        } else {
          return d.data.nodeContent.fieldId;
        }
      });

    // Lower Labels
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
          if (Array.isArray(nodeContent.label)) {
            nodeContent.label.forEach((line: string, index: number) => {
              self
                .append('tspan') // insert tspans forEach
                .attr('x', d.x)
                .attr('y', d.y + (index + 1) * 15)
                .text(line);
            });
          } else {
            self
              .text(nodeContent.label)
              .attr('x', d.x)
              .attr('y', d.y + 15);
          }
        });
      });
    // };
  };

  return (
    <div
      id="expandedExpressionTreeGraph"
      className="expandedExpressionTreeGraphContainer"
    />
  );
};

interface IBasicPieChartProps {
  width: number;
  height: number;
  // top: number;
  // right: number;
  // bottom: number;
  // left: number;
  data: any[];
}

export default ExpandedExpressionTreeGraph;
