export interface NoticeListItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  active: boolean;
  updatedAt: string;
}

export interface NoticeRequest {
  title: string;
  content: string;
}
