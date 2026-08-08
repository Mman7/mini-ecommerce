export type Category = {
  readonly id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateCategoryInput = {
  name?: string;
  description?: string;
};
