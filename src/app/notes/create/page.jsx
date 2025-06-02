"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import jwt from "jsonwebtoken";

export default function CreateNotePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwt.decode(token);
      if (!decodedToken || !decodedToken.exp) {
        return true;
      }
      
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Helper function to refresh token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      
      // Update localStorage with new tokens
      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  // Helper function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    toast({
      variant: "destructive",
      title: "Sesi berakhir",
      description: "Silakan login kembali.",
    });
    router.push("/");
  };

  // Initialize component
  useEffect(() => {
    const initializeAuth = async () => {
      setMounted(true);
      
      let savedToken = localStorage.getItem("token");
      
      if (!savedToken) {
        router.push("/");
        return;
      }

      // Check if token is expired
      if (isTokenExpired(savedToken)) {
        console.log("Token expired, attempting to refresh...");
        
        // Try to refresh token
        const newToken = await refreshToken();
        
        if (newToken) {
          savedToken = newToken;
          console.log("Token refreshed successfully");
        } else {
          console.log("Token refresh failed");
          handleLogout();
          return;
        }
      }

      try {
        const decodedToken = jwt.decode(savedToken);
        
        if (decodedToken && decodedToken.userId) {
          setUser(decodedToken.userId);
          setToken(savedToken);
        } else {
          console.error("Invalid token structure");
          handleLogout();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    };

    initializeAuth();
  }, [router]);

  // API request with automatic token refresh
  const makeAuthenticatedRequest = async (url, options = {}) => {
    let currentToken = token;

    // Check if current token is expired
    if (isTokenExpired(currentToken)) {
      console.log("Token expired during request, refreshing...");
      const newToken = await refreshToken();
      
      if (newToken) {
        currentToken = newToken;
        setToken(newToken);
      } else {
        handleLogout();
        throw new Error("Authentication failed");
      }
    }

    // Make the request with current token
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${currentToken}`,
      },
    });

    // If we get 401, try to refresh token once more
    if (response.status === 401) {
      console.log("Received 401, attempting token refresh...");
      const newToken = await refreshToken();
      
      if (newToken) {
        setToken(newToken);
        
        // Retry the request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            "Authorization": `Bearer ${newToken}`,
          },
        });
      } else {
        handleLogout();
        throw new Error("Authentication failed");
      }
    }

    return response;
  };

  const handleCreate = async () => {
    // Validasi input
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: "Judul dan isi tidak boleh kosong.",
      });
      return;
    }

    // Validasi token dan user
    if (!token || !user) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: "Sesi telah berakhir. Silakan login kembali.",
      });
      handleLogout();
      return;
    }

    // Validasi environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: "Konfigurasi server tidak valid.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const requestUrl = `${apiUrl}/notes`;
      const requestBody = {
        id_user: user,
        title: title.trim(),
        content: content.trim(),
      };

      console.log("Creating note...");

      // Use authenticated request helper
      const res = await makeAuthenticatedRequest(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const responseText = await res.text();
        let errorMessage = "Gagal menambahkan catatan";
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${res.status} ${res.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Success
      toast({
        className: cn("bg-green-500", "text-white"),
        title: "Berhasil!",
        description: "Catatan berhasil disimpan.",
      });

      // Reset form
      setTitle("");
      setContent("");
      
      // Navigate to notes list
      router.push("/notes");
      
    } catch (error) {
      console.error("Error creating note:", error);
      
      if (error.message === "Authentication failed") {
        // Already handled by makeAuthenticatedRequest
        return;
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast({
          variant: "destructive",
          title: "Koneksi gagal",
          description: "Periksa koneksi internet atau server.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Gagal menyimpan",
          description: error.message || "Terjadi kesalahan yang tidak diketahui.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while initializing
  if (!mounted) {
    return (
      <div className="mt-20">
        <Card className="max-w-xl mx-auto p-6">
          <div className="text-center">Loading...</div>
        </Card>
      </div>
    );
  }

  // Show message if no user (will redirect)
  if (!user || !token) {
    return (
      <div className="mt-20">
        <Card className="max-w-xl mx-auto p-6">
          <div className="text-center">Mengarahkan ke halaman login...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <Card className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl text-center font-bold">Buat Catatan Baru</h1>

        {/* Token status indicator (for debugging) */}
        <div className="text-xs text-gray-500 text-center">
          Token status: {isTokenExpired(token) ? "Expired" : "Valid"}
        </div>

        <div>
          <Label
            htmlFor="title"
            className="ml-2 block text-lg font-medium mb-1"
          >
            Judul
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul catatan..."
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="content" className="ml-2 block text-lg font-medium mb-1">
            Isi
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Tulis isi catatan di sini..."
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="secondary" 
            onClick={() => router.back()}
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Card>
    </div>
  );
}