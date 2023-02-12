
export interface UserInfo {
  avatar: string
  nickname: string
  phone: string
}

export interface ApiResponseType<T> {
  code: number
  data: T
  msg: string
}

export interface AppFunctionResult {
  code: string
  error?: string
  data?: any
}

export interface wd_option {
  label: String
  content: String
}

export interface wd_questions {
  type: String
  content: String
  options: [wd_option]
  answer: wd_option
}
