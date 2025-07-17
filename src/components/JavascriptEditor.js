import Editor from "../components/codeMirror/Editor";
import {languageServer} from "@marimo-team/codemirror-languageserver";
import {useMemo} from "@bpmn-io/properties-panel/preact/hooks";
import {javascript, esLint} from "@codemirror/lang-javascript"
import {linter, lintGutter} from "@codemirror/lint"
import {EditorView} from "codemirror"
import * as eslint from "eslint-linter-browserify";
import globals from 'globals'

export default function JavascriptEditor(props) {
    const {
        id,
        extensions = [],
        setValue,
        value,
        readOnly = false,
        ref,
        onFocus,
        onBlur,
    } = props;


    const ls = useMemo(() => {
        return languageServer({
            serverUri: 'ws://localhost:3000/javascript',
            rootUri: 'file:///',
            documentUri: `file:///`, // Unique document URI for the editor.
            languageId: 'javascript', // As defined at https://microsoft.github.io/language-server-protocol/specification#textDocumentItem.

            keyboardShortcuts: {
                rename: 'F2',                // Default: F2
                goToDefinition: 'ctrlcmd',   // Ctrl/Cmd + Click
            },

            allowHTMLContent: true,
        });
    }, []);

    const eslintExtension = useMemo(() => {
        return linter(esLint(new eslint.Linter(), {
            languageOptions: {
                globals: {
                    ...globals.es2015
                },
                parserOptions: {
                    ecmaVersion: 2015,
                    sourceType: "script",
                    ecmaFeatures: {
                        globalReturn: true
                    }
                }
            }
        }));
    }, []);

    return <Editor
        id={id}
        ref={ref}
        setValue={setValue}
        value={value}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}

        extensions={[
            javascript(),
            lintGutter(),
            eslintExtension,
            ls,
            ...extensions,
        ].filter(Boolean)}
    />
};