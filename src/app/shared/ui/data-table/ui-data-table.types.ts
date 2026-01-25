export interface UiTableColumn<T = any> {
    key: string;
    header: string;
    type?: 'text' | 'date' | 'currency' | 'badge' | 'avatar' | 'icon' | 'actions';
    cell?: (row: T) => string | number; // Optional transform
    width?: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    imageProperty?: string; // Property for avatar image
    iconProperty?: string; // Property for column icon
}

export interface UiTableAction<T = any> {
    id: string;
    icon: string;
    label?: string;
    color?: 'primary' | 'warn' | 'accent';
    tooltip?: string;
    action: (row: T) => void;
}

export interface UiTableConfig<T = any> {
    pageSize?: number;
    pageSizeOptions?: number[];
    elevation?: boolean;
    rowClickable?: boolean;
}
