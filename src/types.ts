export interface LocationPreset {
  name: string;
  traffic: number;
  environment: number;
  jobs: number;
  infra: number;
  nature: number;
  school: number;
}

export interface NotebookItem {
  title: string;
  subtitle: string;
  content: string; // HTML string or React element structure
}

export type ProductType = 'apt' | 'villa' | 'house';

export interface ProductDetail {
  bgClass: string;
  titleLeft: string;
  titleLeftClass: string;
  iconLeft: string;
  leftList: string[];
  titleRight: string;
  titleRightClass: string;
  iconRight: string;
  rightList: string[];
}
