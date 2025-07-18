import EditorCodeMirror from "./codeMirror/EditorCodeMirror";
import {languageServer} from "@marimo-team/codemirror-languageserver";
import {useMemo} from "@bpmn-io/properties-panel/preact/hooks";
import {javascript, esLint} from "@codemirror/lang-javascript"
import {linter, lintGutter} from "@codemirror/lint"
import {EditorView} from "codemirror"
import * as eslint from "eslint-linter-browserify";
import globals from 'globals'
import EditorMonaco from "./codeMirror/EditorMonaco";

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

    return <EditorMonaco
        id={id}
        ref={ref}
        setValue={setValue}
        value={value}
        readOnly={readOnly}
        language="javascript"
    />
};