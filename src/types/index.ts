export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
}

export interface BookFilter {
  searchTerm: string;
  yearFrom?: number;
  yearTo?: number;
}