import Editor from "../components/codeMirror/Editor";
import {EditorView} from "codemirror"
import {StreamLanguage} from '@codemirror/language';
import {groovy} from "@codemirror/legacy-modes/mode/groovy"

export default function GroovyEditor(props) {
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

    return <Editor
        id={id}
        ref={ref}
        setValue={setValue}
        value={value}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}

        extensions={[
            StreamLanguage.define(groovy),
            ...extensions,
        ].filter(Boolean)}
    />
};