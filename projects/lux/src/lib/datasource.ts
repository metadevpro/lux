export interface DataSourceItem<K, L> {
  key: K;
  label: L;
}
export type DataSource<K, L> = DataSourceItem<K, L>[];

export interface DecoratedDataSourceItem {
  key: any;
  label: string;
  labelPrefix: string;
  labelMatch: string;
  labelPostfix: string;
}
export type DecoratedDataSource = DecoratedDataSourceItem[];
