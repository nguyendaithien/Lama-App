import { Service } from 'typedi';

import { PaginationDto, PaginationParamsDto } from '@src/dto/pagination.dto';

@Service()
export default class PaginationService {
  paginate<TModel>(
    params: PaginationParamsDto,
    items: TModel[],
    total: number,
  ): PaginationDto<TModel> {
    const result: PaginationDto<TModel> = {
      items,
      meta: {
        itemCount: items.length,
        totalItems: total,
        itemsPerPage: params.limit,
        totalPages: Math.ceil(total / params.limit),
        currentPage: params.page,
      },
    };

    return result;
  }
}
