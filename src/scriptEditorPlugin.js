import {Group} from '@bpmn-io/properties-panel';
import {ScriptTaskProps} from "./props/ScriptTaskProps";

const LOW_PRIORITY = 500;

function ScriptEditorPlugin(propertiesPanel, translate) {

    this.getGroups = function (element) {
        return function (groups) {
            // replace CamundaPlatform__Script with custom ScriptProps

            groups = groups.map(group => {
                if (group.id === 'CamundaPlatform__Script') {
                    return {
                        label: translate('Script'),
                        id: 'CamundaPlatform__Script',
                        component: Group,
                        entries: [
                            ...ScriptTaskProps({element})
                        ]
                    };
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
    'translate',
];

export default {
    __init__: ['scriptEditorPlugin'],
    scriptEditorPlugin: ['type', ScriptEditorPlugin]
};
