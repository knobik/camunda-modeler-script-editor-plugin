import * as monaco from 'monaco-editor';
import {useRef, useEffect} from "@bpmn-io/properties-panel/preact/hooks";

export default function EditorMonaco(props) {
    const {
        language,
        setValue,
        value,
        readOnly = false,
    } = props;

    const viewRef = useRef(null);
    const editorRef = useRef(null);

    function resizeEditor() {
        const contentHeight = Math.min(500, Math.max(20, editorRef.current.getContentHeight()));
        viewRef.current.style.height = contentHeight + 'px';
        editorRef.current.layout();
    }

    useEffect(() => {
        if (viewRef.current) {

            editorRef.current = monaco.editor.create(viewRef.current, {
                value,
                language,
                readOnly,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                minimap: {
                    enabled: false
                },
            });

            editorRef.current.onDidChangeModelContent((e) => {
                const newValue = editorRef.current.getModel().getValue();
                setValue(newValue);
            });

            editorRef.current.onDidContentSizeChange(() => {
                resizeEditor();
            });

            resizeEditor();
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
                editorRef.current = null;
            }
        };
    }, []);

    return (
        <div ref={viewRef}></div>
    );
}