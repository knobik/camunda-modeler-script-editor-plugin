import {EditorView, basicSetup} from "codemirror"
import {keymap} from "@codemirror/view"
import {EditorState, Compartment} from '@codemirror/state';
import {indentWithTab} from "@codemirror/commands"
import {indentUnit} from '@codemirror/language';

import {javascript} from "@codemirror/lang-javascript"
import {StreamLanguage} from "@codemirror/language"
import {groovy} from "@codemirror/legacy-modes/mode/groovy"


import {useRef, useEffect} from "@bpmn-io/properties-panel/preact/hooks";

export default function Editor(props) {
    const {
        language,
        extensions = [],
        setValue,
        value,
        readOnly = false,
    } = props;

    const viewRef = useRef(null);
    const editorRef = useRef(null);
    const compartmentRef = useRef(new Compartment);

    const getLanguage = () => {
        return language === 'javascript' ? javascript() : StreamLanguage.define(groovy);
    }

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.dispatch({
                effects: compartmentRef.current.reconfigure(getLanguage())
            })
        }
    }, [language]);

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
                    keymap.of([indentWithTab]),
                    compartmentRef.current.of(getLanguage()),
                    ...extensions
                ]
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