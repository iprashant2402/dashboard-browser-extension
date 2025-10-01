import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread
} from "lexical";

import { DecoratorNode } from "lexical";
import * as React from "react";
import { Suspense } from "react";
import { TaskBoardData } from './types';
import { createDefaultTaskBoard } from './utils';

const TaskBoardComponent = React.lazy(
  () => import("./TaskBoardComponent").then(module => ({ default: module.TaskBoardComponent }))
);

export interface TaskBoardPayload {
  title?: string;
  data?: TaskBoardData;
  key?: NodeKey;
}

function convertTaskBoardElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLElement && domNode.getAttribute('data-task-board')) {
    const dataAttr = domNode.getAttribute('data-task-board-data');
    let data: TaskBoardData;
    
    if (dataAttr) {
      try {
        data = JSON.parse(dataAttr);
      } catch {
        data = createDefaultTaskBoard();
      }
    } else {
      data = createDefaultTaskBoard();
    }
    
    const node = $createTaskBoardNode({ data });
    return { node };
  }
  return null;
}

export type SerializedTaskBoardNode = Spread<
  {
    data: TaskBoardData;
    type: "taskboard";
    version: 1;
  },
  SerializedLexicalNode
>;

export class TaskBoardNode extends DecoratorNode<React.JSX.Element> {
  __data: TaskBoardData;

  static getType(): string {
    return "taskboard";
  }

  static clone(node: TaskBoardNode): TaskBoardNode {
    return new TaskBoardNode(
      node.__data,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedTaskBoardNode): TaskBoardNode {
    const { data } = serializedNode;
    const node = $createTaskBoardNode({ data });
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div");
    element.setAttribute("data-task-board", "true");
    element.setAttribute("data-task-board-data", JSON.stringify(this.__data));
    element.innerHTML = `<p>Task Board: ${this.__data.title}</p>`;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: Node) => {
        if (node instanceof HTMLElement && node.getAttribute('data-task-board')) {
          return {
            conversion: convertTaskBoardElement,
            priority: 1
          };
        }
        return null;
      }
    };
  }

  constructor(
    data: TaskBoardData,
    key?: NodeKey
  ) {
    super(key);
    this.__data = data || createDefaultTaskBoard();
  }

  exportJSON(): SerializedTaskBoardNode {
    return {
      data: this.__data,
      type: "taskboard",
      version: 1
    };
  }

  updateData(data: TaskBoardData): void {
    const writable = this.getWritable();
    writable.__data = data;
  }

  getData(): TaskBoardData {
    return this.__data;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    const theme = config.theme;
    const className = theme.taskboard;
    if (className !== undefined) {
      div.className = className;
    }
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.JSX.Element {
    return (
      <Suspense fallback={<div className="task-board-loading">Loading Task Board...</div>}>
        <TaskBoardComponent
          nodeKey={this.getKey()}
          data={this.__data}
        />
      </Suspense>
    );
  }
}

export function $createTaskBoardNode({
  title,
  data,
  key
}: TaskBoardPayload = {}): TaskBoardNode {
  const taskBoardData = data || createDefaultTaskBoard(title);
  return new TaskBoardNode(taskBoardData, key);
}

export function $isTaskBoardNode(
  node: LexicalNode | null | undefined
): node is TaskBoardNode {
  return node instanceof TaskBoardNode;
}
