export const BASE_WEB_API_URL = process.env.NEXT_PUBLIC_APP_WEB_API_URL
export const WEB_API_PATH_LOGIN = "users/login/"
export const WEB_API_API_PATH_GET_MENU_OPTIONS = "users/menu_options/"
export const WEB_API_GET_USER_LIST = "users/list_users"
export const WEB_API_CREATE_USER = "users/create_user/"
export const WEB_API_UPDATE_USER = "users/update_user/"
export const WEB_API_GET_ROLES_LIST = "users/get_roles_list"
export const WEB_API_CHANGE_USER_STATE = "users/change_user_state/"
export const WEB_API_GET_USER = "users/get_user/"
export const WEB_API_CHANGE_PASSWORD = "users/change_password/"
export const WEB_API_CREATE_TASK = "tasks/create_task/"
export const WEB_API_UPDATE_TASK = "tasks/update_task/"
export const WEB_API_GET_TASKS_LIST = "tasks/get_tasks_list"
export const WEB_API_GET_TASK = "tasks/get_task/"
export const WEB_API_GET_TAGS_LIST = "tasks/get_tags_list/"
export const WEB_API_CREATE_TAG = "tasks/create_tag/"
export const WEB_API_UPDATE_TAG = "tasks/update_tag/"

// internal routes
export const PATH_LOGIN = "/login"
export const PATH_HOME = "/"
export const PATH_DASHBOARD = "/dashboard"
export const PATH_TASKS = "/tasks"
export const PATH_PAYROLL = "/payroll"
export const PATH_HELP = "/help"
export const PATH_SETTINGS = "/settings"
export const PATH_EMPLOYEES = "/employees"

export const protectedRoutes = [
  PATH_HOME,
  PATH_DASHBOARD,
  PATH_TASKS,
  PATH_PAYROLL,
  PATH_HELP,
  PATH_SETTINGS,
  PATH_EMPLOYEES,
]

export const publicRoutes = [PATH_LOGIN]
