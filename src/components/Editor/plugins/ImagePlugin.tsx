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

import { $createImageNode, ImageNode, ImagePayload } from "../nodes/ImageNode/ImageNode";
import { Dialog } from "../../Dialog";
import { Button } from "../../Button";
import './ImagePlugin.css';
import { IoCheckmarkCircle } from "react-icons/io5";
import { isImgUrl } from "../../../utils/helpers";

const ERROR_MESSAGE = 'Nope, that\'s not the correct image URL. Best to double check.';

export type InsertImagePayload = Readonly<ImagePayload>;

const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand(
  "INSERT_IMAGE_COMMAND"
);

export const INSERT_IMAGE_COMMAND_SELECTED_EVENT = "INSERT_IMAGE_COMMAND_SELECTED_EVENT";

export default function ImagesPlugin({
  captionsEnabled
}: {
  captionsEnabled?: boolean;
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [imageFormOpen, setImageFormOpen] = useState(false);
  const [imagePayload, setImagePayload] = useState<Partial<InsertImagePayload> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listener = () => {
      setImageFormOpen(true);
    }
    window.addEventListener(INSERT_IMAGE_COMMAND_SELECTED_EVENT, listener);
    return () => {
      window.removeEventListener(INSERT_IMAGE_COMMAND_SELECTED_EVENT, listener);
    }
  }, [setImageFormOpen])

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [captionsEnabled, editor]);

  const insertImage = async () => {
    if(!imagePayload || !imagePayload.src) return;
    setIsLoading(true);
    try {
        const isValidUrl = await isImgUrl(imagePayload.src);
        if (!isValidUrl) {
            setError(ERROR_MESSAGE);
            return;
        }
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            ...imagePayload,
            src: imagePayload.src ?? '',
            altText: imagePayload.altText ?? '',
            width: imagePayload.width ?? '100%',
        });
        setImageFormOpen(false);
    } catch (error) {
        console.error(error);
        setError(ERROR_MESSAGE);
    } finally {
        setIsLoading(false);
    }
  }

    return <Dialog title="Insert image" isOpen={imageFormOpen} onClose={() => setImageFormOpen(false)}>
      <div className="image-form-wrapper">
        <div className="image-form-item">
            <input placeholder="Paste image URL here" type="text" value={imagePayload?.src} onChange={(e) => setImagePayload({...imagePayload, src: e.target.value})} />
            <Button variant="clear" onClick={insertImage} disabled={!imagePayload?.src || isLoading} icon={<IoCheckmarkCircle size={32} />} />
        </div>
        <div className="image-form-error">
            {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </Dialog>;
}
