import {ScriptTaskProps} from "./props/ScriptTaskProps";
import {InputProps} from "./props/InputProps";
import {OutputProps} from "./props/OutputProps";
import {TaskListenerProps, ExecutionListenerProps} from "./props/ListenerProps";
import {ConditionProps} from "./props/ConditionProps";

const LOW_PRIORITY = 500;

function ScriptEditorPlugin(propertiesPanel, injector) {

    this.getGroups = function (element) {
        return function (groups) {

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

                if (group.id === 'CamundaPlatform__ExecutionListener') {
                    group = {
                        ...group,
                        ...ExecutionListenerProps({element, injector})
                    };
                }

                if (group.id === 'CamundaPlatform__Condition') {
                    group.entries = [
                        ...ConditionProps({element})
                    ];
                }

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
