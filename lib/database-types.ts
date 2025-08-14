export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
        };
      };
      dashboards: {
        Row: {
          id: number;
          title: string;
          url: string;
          category_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          url: string;
          category_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          url?: string;
          category_id?: number;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: number;
          username: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          username: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          username?: string;
          password_hash?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
