export interface TableConfig {
    label: string;
    render: (data: any) => any;
    subtitle?: string;
}