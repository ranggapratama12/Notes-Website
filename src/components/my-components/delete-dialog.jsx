"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export function DialogDelete({ note, onDeleteSuccess, onRefreshData }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize token on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    
    if (!savedToken) {
      toast({
        variant: "destructive",
        title: "Sesi berakhir",
        description: "Silakan login kembali.",
      });
      router.push("/");
      return;
    }

    try {
      const decodedToken = jwt.decode(savedToken);
      if (decodedToken && decodedToken.userId) {
        setUser(decodedToken.userId);
        setToken(savedToken);
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [router, toast]);

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
      
      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      setToken(data.accessToken);
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

  // Auto refresh data function
  const triggerAutoRefresh = async () => {
    try {
      // Trigger callback untuk update parent component
      if (onDeleteSuccess) {
        onDeleteSuccess(note.id_notes);
      }

      // Trigger refresh data jika tersedia
      if (onRefreshData) {
        await onRefreshData();
      }

      // Auto refresh halaman setelah 500ms untuk memastikan UI terupdate
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      console.error("Error during auto refresh:", error);
      // Fallback: force refresh halaman
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!token || !note) {
      toast({
        variant: "destructive",
        title: "Gagal menghapus",
        description: "Data tidak valid.",
      });
      return;
    }

    // Validate environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      toast({
        variant: "destructive",
        title: "Gagal menghapus",
        description: "Konfigurasi server tidak valid.",
      });
      return;
    }

    setLoading(true);
    
    try {
      let currentToken = token;

      // Check if token is expired and refresh if needed
      if (isTokenExpired(currentToken)) {
        console.log("Token expired, refreshing...");
        const newToken = await refreshToken();
        
        if (newToken) {
          currentToken = newToken;
        } else {
          handleLogout();
          return;
        }
      }

      console.log("Deleting note:", note.id_notes);
      console.log("API URL:", `${apiUrl}/notes`);

      const res = await fetch(`${apiUrl}/notes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          id_notes: note.id_notes,
        }),
      });

      console.log("Delete response status:", res.status);

      // Handle 401 - try token refresh once more
      if (res.status === 401) {
        console.log("Received 401, attempting token refresh...");
        const newToken = await refreshToken();
        
        if (newToken) {
          // Retry with new token
          const retryRes = await fetch(`${apiUrl}/notes`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${newToken}`,
            },
            body: JSON.stringify({
              id_notes: note.id_notes,
            }),
          });

          if (!retryRes.ok) {
            const errorText = await retryRes.text();
            console.error("Retry delete failed:", errorText);
            throw new Error("Gagal menghapus catatan setelah refresh token");
          }
        } else {
          handleLogout();
          return;
        }
      } else if (!res.ok) {
        const errorText = await res.text();
        console.error("Delete failed:", errorText);
        
        let errorMessage = "Gagal menghapus catatan";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${res.status} ${res.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Success - Show toast
      toast({
        className: cn("bg-green-500", "text-white"),
        title: "Berhasil!",
        description: "Catatan berhasil dihapus.",
      });

      // Close dialog
      setOpen(false);
      
      // Trigger auto refresh
      await triggerAutoRefresh();

    } catch (error) {
      console.error("Error deleting note:", error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast({
          variant: "destructive",
          title: "Koneksi gagal",
          description: "Periksa koneksi internet atau server.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Gagal menghapus catatan",
          description: error.message || "Terjadi kesalahan saat menghapus.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no token
  if (!token) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600">
            Hapus Catatan?
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin
            menghapus catatan "{note?.title || 'ini'}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}