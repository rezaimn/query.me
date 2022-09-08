export const canLoadMoreDataForInfiniteScroll = (response: any, action: any) => {
  return response.result.length === action.payload.page_size;
}
