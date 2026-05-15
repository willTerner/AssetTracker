// Color palette — 暖橙轻语 (Coral Whisper)
export const Colors = {
    espresso: '#5C3D2E',
    espressoDark: '#4A3728',
    warmBrown: '#A08070',
    coral: '#E8956D',
    coralDark: '#D4745E',
    honey: '#F3BC8B',
    sand: '#FDE4C5',
    offWhite: '#FFFAF3',
    sage: '#7EB89B',
    white: '#FFFFFF',
} as const;

interface PickerPlaceholder {
    label: string;
    value: null;
}

export const DEFAULT_PICKER_PLACEHOLDER: PickerPlaceholder = {
    label: '请选择货币',
    value: null,
};
