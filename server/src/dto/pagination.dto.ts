export interface PaginationParamsDto {
  page?: number;
  limit?: number;
}

export interface PaginationMetaDto {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationDto<TModel> {
  items: TModel[];
  meta: PaginationMetaDto;
}
