export interface IView {
  id: number;
  name: string;
  icon: string;
  params?: string;
}

export interface IViewForCreation {
  name: string;
  icon: string;
  view_type?: string;
  url: string;
  params?: string;
}
