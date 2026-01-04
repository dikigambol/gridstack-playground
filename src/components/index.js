// Import komponen yang kita punya
import ContainerWidget from "./ContainerWidget";
import TextWidget from "./TextWidget";

export const widgetRegistry = {
    "Container Widget": {
        component: ContainerWidget,
        defaultSize: { w: 4, h: 4 },
    },
    "Text Widget": {
        component: TextWidget,
        defaultSize: { w: 2, h: 3 },
    },
};

export const getWidgetComponent = (label) => {
    return widgetRegistry[label]?.component || null;
};