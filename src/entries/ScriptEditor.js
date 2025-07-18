import {DescriptionEntry} from '@bpmn-io/properties-panel';
import {TooltipEntry} from '@bpmn-io/properties-panel';

import {EditorView} from "codemirror"

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from '@bpmn-io/properties-panel/preact/hooks';

import classnames from 'classnames';

import {
    useError,
    useShowEntryEvent,
} from '@bpmn-io/properties-panel';

import {isFunction} from 'min-dash';
import JavascriptEditor from "../components/JavascriptEditor";
import GroovyEditor from "../components/GroovyEditor";

function ScriptEditor(props) {

    const {
        id,
        label,
        debounce,
        onInput,
        value = '',
        disabled,
        onFocus,
        onBlur,
        tooltip,
        language,
    } = props;

    const [localValue, setLocalValue] = useState(value);

    const ref = useShowEntryEvent(id);

    /**
     * @type { import('min-dash').DebouncedFunction }
     */
    const handleInputCallback = useMemo(() => {
        return debounce((newValue) => {
            onInput(newValue);
        });
    }, [onInput, debounce]);

    const handleInput = newValue => {
        const newModelValue = newValue === '' ? undefined : newValue;
        handleInputCallback(newModelValue);
    };

    const handleLocalInput = (v) => {
        if (v === localValue) {
            return;
        }

        setLocalValue(v);
        handleInput(v);
    };

    const theme = useMemo(() => {
        // Calculate line height for 30 lines
        // Default line height is typically around 1.2em-1.4em
        const lineHeight = 1.3; // em
        const maxLines = 30;
        const maxHeight = `${lineHeight * maxLines}em`;

        return EditorView.baseTheme({
            '&.cm-focused': {
                outline: 'none',
            },
            '&': {
                border: '1px solid #B8BCC5',
            },
            '.cm-content': {
                // Remove the fixed height constraint
                minHeight: '1.3em', // At least one line
                maxHeight: maxHeight,
            },
            '.cm-scroller': {
                // Enable scrolling when content exceeds max height
                overflow: 'auto',
                maxHeight: maxHeight,
            },
            '.cm-wrap': {
                // Allow it to grow up to max height
                height: 'auto',
                maxHeight: maxHeight,
                border: '1px solid silver',
            },
            '.cm-tooltip pre': {
                margin: '2px 5px',
            },
            '.cm-tooltip p': {
                margin: '7px 5px 2px 5px',
            },
        });
    }, []);

    useEffect(() => {
        if (value === localValue) {
            return;
        }

        setLocalValue(value);
    }, [value]);

    return (
        <div class="bio-properties-panel-textarea">
            <label for={prefixId(id)} class="bio-properties-panel-label">
                <TooltipEntry value={tooltip} forId={id} element={props.element}>
                    {label}
                </TooltipEntry>
            </label>
            {language === 'javascript' && (
                <JavascriptEditor
                    id={prefixId(id)}
                    ref={ref}
                    setValue={handleLocalInput}
                    value={localValue}
                    readOnly={disabled}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    extensions={[
                        theme,
                        EditorView.lineWrapping,
                    ].filter(Boolean)}
                />
            )}
            {language === 'groovy' && (
                <GroovyEditor
                    id={prefixId(id)}
                    ref={ref}
                    setValue={handleLocalInput}
                    value={localValue}
                    readOnly={disabled}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    extensions={[
                        theme,
                        EditorView.lineWrapping,
                    ].filter(Boolean)}
                />
            )}
        </div>
    );
}

/**
 * @param {object} props
 * @param {object} props.element
 * @param {string} props.id
 * @param {string} props.description
 * @param {boolean} props.debounce
 * @param {string} props.label
 * @param {Function} props.getValue
 * @param {Function} props.setValue
 * @param {Function} props.onFocus
 * @param {Function} props.onBlur
 * @param {number} props.rows
 * @param {boolean} props.monospace
 * @param {Function} [props.validate]
 * @param {boolean} [props.disabled]
 */
export default function ScriptEditorEntry(props) {
    const {
        element,
        id,
        description,
        debounce,
        label,
        getValue,
        setValue,
        rows,
        monospace,
        disabled,
        validate,
        onFocus,
        onBlur,
        placeholder,
        autoResize,
        tooltip,
        language,
    } = props;

    const globalError = useError(id);
    const [localError, setLocalError] = useState(null);

    let value = getValue(element);

    useEffect(() => {
        if (isFunction(validate)) {
            const newValidationError = validate(value) || null;

            setLocalError(newValidationError);
        }
    }, [value, validate]);

    const onInput = useCallback((newValue) => {
        const value = getValue(element);
        let newValidationError = null;

        if (isFunction(validate)) {
            newValidationError = validate(newValue) || null;
        }

        if (newValue !== value) {
            setValue(newValue, newValidationError);
        }

        setLocalError(newValidationError);
    }, [element]);


    const error = globalError || localError;

    return (
        <div
            class={classnames(
                'bio-properties-panel-entry',
                error ? 'has-error' : '')
            }
            data-entry-id={id}>
            <ScriptEditor
                id={id}
                key={element}
                label={label}
                value={value}
                onInput={onInput}
                onFocus={onFocus}
                onBlur={onBlur}
                rows={rows}
                debounce={debounce}
                monospace={monospace}
                disabled={disabled}
                placeholder={placeholder}
                autoResize={autoResize}
                tooltip={tooltip}
                element={element}
                language={language}
            />
            {error && <div class="bio-properties-panel-error">{error}</div>}
            <DescriptionEntry forId={id} element={element} value={description}/>
        </div>
    );
}

export function isEdited(node) {
    return node && !!node.value;
}


// helpers /////////////////

function prefixId(id) {
    return `bio-properties-panel-${id}`;
}