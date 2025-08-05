import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";

const baseURL = import.meta.env.PROD
  ? "http://124.70.211.197/api"
  : "/api";

// 定义响应数据结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean; // 是否跳过错误处理
  showLoading?: boolean; // 是否显示加载状态
}

// HTTP 状态码枚举
enum HttpStatus {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

class HttpClient {
  private instance: AxiosInstance;
  private loadingCount = 0;

  constructor() {
    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 显示加载状态
        if ((config as any).showLoading !== false) {
          this.showLoading();
        }

        // 添加认证token
        const token = this.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 请求日志
        console.log(
          `[REQUEST] ${config.method?.toUpperCase()} ${config.url}`,
          config.data
        );

        return config;
      },
      (error) => {
        this.hideLoading();
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        this.hideLoading();

        // 响应日志
        console.log(`[RESPONSE] ${response.status}`, response.data);

        // 统一处理业务错误
        if (response.data && response.data.code !== HttpStatus.SUCCESS) {
          this.handleBusinessError(response.data);
          return Promise.reject(new Error(response.data.message));
        }

        return response;
      },
      (error) => {
        this.hideLoading();

        // 跳过错误处理
        if (error.config?.skipErrorHandler) {
          return Promise.reject(error);
        }

        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  // 获取token
  private getToken(): string | null {
    return localStorage.getItem("blog_token") || sessionStorage.getItem("blog_token");
  }

  // 显示加载状态
  private showLoading(): void {
    this.loadingCount++;
    // 这里可以集成你的loading组件
    console.log("Loading...");
  }

  // 隐藏加载状态
  private hideLoading(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      console.log("Loading finished");
    }
  }

  // 处理业务错误
  private handleBusinessError(data: ApiResponse): void {
    switch (data.code) {
      case HttpStatus.UNAUTHORIZED:
        this.handleUnauthorized();
        break;
      case HttpStatus.FORBIDDEN:
        this.showMessage(
          `访问被拒绝: ${data.message || "无权限访问"}`,
          "error"
        );
        break;
      default:
        this.showMessage(data.message || "操作失败，请稍后重试", "error");
    }
  }

  // 处理HTTP错误
  private handleError(error: any): void {
    let message = "网络请求失败";

    if (error.response) {
      // 服务器响应了错误状态码
      const { status, data } = error.response;

      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          this.handleUnauthorized();
          return;
        case HttpStatus.FORBIDDEN:
          message = data?.message || "您没有权限执行此操作";
          break;
        case HttpStatus.NOT_FOUND:
          message = data?.message || "请求的资源不存在";
          break;
        case HttpStatus.SERVER_ERROR:
          message = data?.message || "服务器内部错误，请稍后重试";
          break;
        default:
          message = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message = "网络连接异常，请检查网络设置";
    } else {
      // 其他错误
      message = error.message || "请求配置错误";
    }

    this.showMessage(message, "error");
  }

  // 处理未授权
  private handleUnauthorized(): void {
    this.showMessage("登录已过期，请重新登录", "error");
    // 清除token
    localStorage.removeItem("blog_token");
    sessionStorage.removeItem("blog_token");
    // 跳转到登录页面
    window.location.href = "/login";
  }

  // 显示消息提示
  private showMessage(
    message: string,
    type: "success" | "error" | "warning" = "error"
  ): void {
    ElMessage({
      message,
      type,
      duration: 3000,
      showClose: true,
      grouping: true,
    });
  }

  // GET 请求
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance
      .get<ApiResponse<T>>(url, config)
      .then((res) => res.data);
  }

  // POST 请求
  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.instance
      .post<ApiResponse<T>>(url, data, config)
      .then((res) => res.data);
  }
  // PUT 请求
  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.instance
      .put<ApiResponse<T>>(url, data, config)
      .then((res) => res.data);
  }

  // DELETE 请求
  delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.instance
      .delete<ApiResponse<T>>(url, config)
      .then((res) => res.data);
  }

  // PATCH 请求
  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.instance
      .patch<ApiResponse<T>>(url, data, config)
      .then((res) => res.data);
  }

  // 上传文件
  upload<T = any>(
    url: string,
    file: File,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.instance
      .post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  }

  // 下载文件
  download(
    url: string,
    filename?: string,
    config?: RequestConfig
  ): Promise<void> {
    return this.instance
      .get(url, {
        ...config,
        responseType: "blob",
      })
      .then((response) => {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      });
  }

  // 批量请求
  all<T = any>(requests: Promise<T>[]): Promise<T[]> {
    return Promise.all(requests);
  }

  // 获取原始实例（用于特殊需求）
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建默认实例
const httpClient = new HttpClient();

// 导出实例和类
export { HttpClient, httpClient as default };

// // 使用示例
// export const api = {
//   // 用户相关
//   user: {
//     login: (data: { username: string; password: string }) =>
//       httpClient.post<{ token: string; userInfo: any }>('/auth/login', data),

//     getUserInfo: () =>
//       httpClient.get<{ id: number; name: string; email: string }>('/user/info'),

//     updateProfile: (data: { name: string; email: string }) =>
//       httpClient.put<boolean>('/user/profile', data),
//   },

//   // 文件相关
//   file: {
//     upload: (file: File) =>
//       httpClient.upload<{ url: string; filename: string }>('/file/upload', file),

//     download: (fileId: string, filename?: string) =>
//       httpClient.download(`/file/download/${fileId}`, filename),
//   },
// };

// 类型定义示例
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userInfo: User;
}
