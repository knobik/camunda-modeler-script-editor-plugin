import EditorCodeMirror from "./codeMirror/EditorCodeMirror";
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

    return <EditorCodeMirror
        id={id}
        ref={ref}
        setValue={setValue}
        value={value}
        readOnly={readOnly}

        extensions={[
            EditorView.domEventHandlers({blur: onBlur, focus: onFocus}),
            StreamLanguage.define(groovy),
            ...extensions,
        ].filter(Boolean)}
    />
};