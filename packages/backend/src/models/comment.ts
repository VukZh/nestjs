type CommentStatusType = 'visible' | 'hidden'

export type CommentType = {
  id: string
  status: CommentStatusType
  authorId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type CreatedCommentType = Omit<CommentType, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'>
