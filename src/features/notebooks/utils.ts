import {
  INotebook,
  INotebookPage,
  INotebookPageBlock,
  INotebookPageCoverImage,
  IWorkspace,
} from '../../shared/models';
import { format } from 'date-fns';
import dataTreeEpics from '../../shared/store/epics/dataTreeEpics';


export const getAllBlocksByType = (notebook: INotebook, type: string) => {
  const blocks: any[] = [];
  const uids: any[] = [];
  notebook.pages.forEach((page: INotebookPage) => {
    page.blocks.forEach((block: INotebookPageBlock) => {
      if (block.type === type && block.uid) {
        if (!uids.includes(block.uid)) {
          blocks.push(block);
          uids.push(block.uid);
        }
      }
    });
  });

  return blocks;
}

export const defaultNotebookName = (): string => {
  const date = new Date();
  return 'Untitled - ' + format(date, 'yyyy-MM-dd');
};


export const isFirstPage = (currentPage: number, firstPage: number): boolean => {
  return currentPage === firstPage;
}

export const notebookFromWorkspace = (notebook: INotebook | null, workspace: IWorkspace | null): boolean => {
  if (!notebook || !workspace) {
    return false;
  }

  return (workspace.id === notebook.workspace_id);
};

export const prepareCoverImageData = (coverImage: INotebookPageCoverImage, position: number) => {
  return {
    url: coverImage.url,
    created_by: coverImage.created_by,
    created_by_profile_url: coverImage.created_by_profile_url,
    position: { x: 0, y: position },
  };
};

export const fromUnsplash = (url: string) => url?.includes('images.unsplash.com');
