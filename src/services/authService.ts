// import { api } from "./api";

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
}

export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            /** 
             * TODO: Uncomment the lines below to call your real Login API.
             */
            // const response = await api.post('/auth/login', credentials);
            // return response;

            // Simulating a delay for the API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock success response
            return {
                user: { id: "1", name: "User", email: credentials.email },
                token: "mock-jwt-token"
            };
        } catch (error) {
            console.error("Auth Service Login Error:", error);
            throw error;
        }
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            /** 
             * TODO: Uncomment the lines below to call your real Register API.
             */
            // const response = await api.post('/auth/register', data);
            // return response;

            // Simulating a delay for the API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock success response
            return {
                user: { id: "2", name: data.name, email: data.email },
                token: "mock-jwt-token"
            };
        } catch (error) {
            console.error("Auth Service Register Error:", error);
            throw error;
        }
    }
};
