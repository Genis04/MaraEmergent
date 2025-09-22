import os
from supabase import create_client, Client
from typing import Optional

class SupabaseClient:
    _instance: Optional['SupabaseClient'] = None
    _client: Optional[Client] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseClient, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if self._client is None:
            url = os.environ.get('SUPABASE_URL')
            key = os.environ.get('SUPABASE_ANON_KEY')
            
            if not url or not key:
                raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
            
            self._client = create_client(url, key)

    @property
    def client(self) -> Client:
        return self._client

    def get_table(self, table_name: str):
        """Get a table reference"""
        return self._client.table(table_name)

# Singleton instance
supabase_client = SupabaseClient()

def get_supabase_client() -> Client:
    """Get the Supabase client instance"""
    return supabase_client.client