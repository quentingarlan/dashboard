import { Project } from './project';

export interface User{
  // _id:string;
  projects:Project[];
  updatedAt:string;
  createdAt:string;
  accountId:string;
  country:string;
  software:string;
  version:string;
  id:string;
}
