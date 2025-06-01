import {ScriptTaskProps} from "./props/ScriptTaskProps";
import {InputProps} from "./props/InputProps";
import {OutputProps} from "./props/OutputProps";
import {TaskListenerProps} from "./props/ListenerProps";

const LOW_PRIORITY = 500;

function ScriptEditorPlugin(propertiesPanel, injector) {

    this.getGroups = function (element) {
        return function (groups) {

            // replace CamundaPlatform__Script with custom ScriptProps
            groups = groups.map(group => {

                if (group.id === 'CamundaPlatform__Script') {
                    group.entries = [
                        ...ScriptTaskProps({element})
                    ];
                }

                if (group.id === 'CamundaPlatform__Input') {
                    group = {
                        ...group,
                        ...InputProps({element, injector})
                    };
                }

                if (group.id === 'CamundaPlatform__Output') {
                    group = {
                        ...group,
                        ...OutputProps({element, injector})
                    };
                }

                if (group.id === 'CamundaPlatform__TaskListener') {
                    group = {
                        ...group,
                        ...TaskListenerProps({element, injector})
                    };
                }

                // CamundaPlatform__TaskListener
                // CamundaPlatform__ExecutionListener
                // CamundaPlatform__Condition

                return group;
            });

            return groups;
        };
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this)
}

ScriptEditorPlugin.$inject = [
    'propertiesPanel',
    'injector'
];

export default {
    __init__: ['scriptEditorPlugin'],
    scriptEditorPlugin: ['type', ScriptEditorPlugin]
};
