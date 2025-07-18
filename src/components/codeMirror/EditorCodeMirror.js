import {EditorView, basicSetup} from "codemirror"
import {keymap} from "@codemirror/view"
import {EditorState} from '@codemirror/state';
import {indentLess, indentMore} from "@codemirror/commands"
import {acceptCompletion, completionStatus} from '@codemirror/autocomplete';
import {indentUnit} from '@codemirror/language';
import {useRef, useEffect} from "@bpmn-io/properties-panel/preact/hooks";

export default function EditorCodeMirror(props) {
    const {
        extensions = [],
        setValue,
        value,
        readOnly = false,
    } = props;

    const viewRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        if (viewRef.current) {

            const updateListener = EditorView.updateListener.of(vu => {
                if (
                    vu.docChanged &&
                    typeof setValue === 'function' &&
                    // Fix echoing of the remote changes:
                    // If transaction is market as remote we don't have to call `onChange` handler again
                    !vu.transactions.some((tr) => tr.annotation(External))
                ) {
                    const doc = vu.state.doc;
                    const value = doc.toString();
                    setValue(value);
                }
            });

            editorRef.current = new EditorView({
                parent: viewRef.current,
                doc: value,
                extensions: [
                    basicSetup,
                    updateListener,
                    EditorState.readOnly.of(readOnly),
                    indentUnit.of("    "), // 4 spaces
                    keymap.of([
                        {
                            key: 'Tab',
                            preventDefault: true,
                            shift: indentLess,
                            run: e => {
                                if (!completionStatus(e.state)) return indentMore(e);
                                return acceptCompletion(e);
                            },
                        },
                    ]),
                    ...extensions
                ].filter(Boolean)
            });

        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return (
        <div ref={viewRef}></div>
    );
}