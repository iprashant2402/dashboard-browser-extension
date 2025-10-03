import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand
} from "lexical";
import { useEffect, useState } from "react";

import { $createTaskBoardNode, TaskBoardNode, TaskBoardPayload } from "./TaskBoardNode";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Button } from "../../../Button";
import { Dialog } from "../../../Dialog";

export type InsertTaskBoardPayload = Readonly<TaskBoardPayload>;

const INSERT_TASK_BOARD_COMMAND: LexicalCommand<InsertTaskBoardPayload> = createCommand(
  "INSERT_TASK_BOARD_COMMAND"
);

export const INSERT_TASK_BOARD_COMMAND_SELECTED_EVENT = "INSERT_TASK_BOARD_COMMAND_SELECTED_EVENT";

export default function TaskBoardPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [taskBoardFormOpen, setTaskBoardFormOpen] = useState(false);
  const [taskBoardPayload, setTaskBoardPayload] = useState<Partial<InsertTaskBoardPayload> | null>(null);

  useEffect(() => {
    const listener = () => {
      setTaskBoardFormOpen(true);
    }
    window.addEventListener(INSERT_TASK_BOARD_COMMAND_SELECTED_EVENT, listener);
    return () => {
      window.removeEventListener(INSERT_TASK_BOARD_COMMAND_SELECTED_EVENT, listener);
    }
  }, [setTaskBoardFormOpen])

  useEffect(() => {
    if (!editor.hasNodes([TaskBoardNode])) {
      throw new Error("TaskBoardPlugin: TaskBoardNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertTaskBoardPayload>(
        INSERT_TASK_BOARD_COMMAND,
        (payload) => {
          const taskBoardNode = $createTaskBoardNode(payload);
          $insertNodes([taskBoardNode]);
          if ($isRootOrShadowRoot(taskBoardNode.getParentOrThrow())) {
            $wrapNodeInElement(taskBoardNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  const insertTaskBoard = () => {
    const title = taskBoardPayload?.title?.trim() || 'Task Board';
    
    editor.dispatchCommand(INSERT_TASK_BOARD_COMMAND, {
      title,
      ...taskBoardPayload,
    });
    setTaskBoardFormOpen(false);
    setTaskBoardPayload(null);
  }

  return (
    <Dialog title="Create Task Board" isOpen={taskBoardFormOpen} onClose={() => setTaskBoardFormOpen(false)}>
      <div className="task-board-form-wrapper">
        <div className="task-board-form-item">
          <input 
            placeholder="Enter task board title (optional)" 
            type="text" 
            value={taskBoardPayload?.title || ''} 
            onChange={(e) => setTaskBoardPayload({...taskBoardPayload, title: e.target.value})} 
          />
          <Button
            variant="clear" 
            onClick={insertTaskBoard} 
            icon={<IoCheckmarkCircle size={32} />} 
          />
        </div>
        <div className="task-board-form-description">
          <p>Create a kanban-style task board to organize your work. You can switch between kanban and list views, add custom columns, and drag tasks between columns.</p>
        </div>
      </div>
    </Dialog>
  );
}
