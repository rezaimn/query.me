export interface ITag {
  id?: number;
  name: string;
  uid: string;
}

export interface ITagForCreation {
  name: string;
}

export interface ITagParent {
  objectType: string;
  objectId: number | string;
}
