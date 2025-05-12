export interface TableConfig {
    label: string | JSX.Element;
    render: (data: any) => any;
    subtitle?: string;
}