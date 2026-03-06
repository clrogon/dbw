import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "svg"];
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}

const ImageUpload = ({ value, onChange, folder = "general" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "Ficheiro demasiado grande", description: "O tamanho máximo é 5 MB.", variant: "destructive" });
      return;
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast({ title: "Tipo de ficheiro inválido", description: "Apenas JPG, PNG, WebP, GIF e SVG são permitidos.", variant: "destructive" });
      return;
    }

    // Validate extension
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast({ title: "Extensão inválida", description: `Extensões permitidas: ${ALLOWED_EXTENSIONS.join(", ")}`, variant: "destructive" });
      return;
    }

    setUploading(true);
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("cms-images").upload(path, file);
    if (error) {
      console.error("Upload error:", error);
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="h-32 w-auto rounded-md object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div>
        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
          <label className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "A carregar..." : "Carregar imagem"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handleUpload} className="hidden" />
          </label>
        </Button>
        <p className="text-xs text-muted-foreground mt-1">Máx. 5 MB · JPG, PNG, WebP, GIF, SVG</p>
      </div>
    </div>
  );
};

export default ImageUpload;
