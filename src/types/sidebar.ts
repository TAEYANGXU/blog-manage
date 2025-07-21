interface MetaType {
  title?: string;
  icon?: string;
  hidden?: boolean;
}

export interface RouteItemType {
  path: string;
  meta?: MetaType;
  hidden?: boolean;
  children?: RouteItemType[];
}
