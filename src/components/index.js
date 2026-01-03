// Widget registry - maps widget type/label to component
import React from 'react';

// Import komponen yang kita punya
import ContainerWidget from "./ContainerWidget";
import TextWidget from "./TextWidget";

export const widgetRegistry = {
    "Container Widget": {
        component: ContainerWidget,
        defaultSize: { w: 4, h: 4 },
        defaultData: {
            gridLayout: []
        }
    },
    "Text Widget": {
        component: TextWidget,
        defaultSize: { w: 2, h: 3 },
        defaultData: {
            text: "Widget Teks"
        }
    },
};

export const getWidgetConfig = (label) => {
    return widgetRegistry[label] || null;
};

export const getWidgetComponent = (label) => {
    return widgetRegistry[label]?.component || null;
};

export const getWidgetDefaultSize = (label) => {
    return widgetRegistry[label]?.defaultSize || { w: 4, h: 3 };
};

export const getWidgetDefaultData = (label) => {
    return widgetRegistry[label]?.defaultData || {};
};