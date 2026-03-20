import React from "react";
import { X } from "lucide-react";

interface Props {
  file: File | null;
  fileUrl: string | null;
  isUploading: boolean;
  uploadProgress: number;
  removeImage: () => void;
}

const FilePreview: React.FC<Props> = React.memo(
  ({ file, fileUrl, isUploading, uploadProgress, removeImage }) => {
    if (!file && !fileUrl && !isUploading) return null;
return (
  <div className="border-t bg-background px-3 py-3 sm:px-6 sm:py-4">
    
    {/* Preview Container */}
    {(fileUrl || isUploading) && (
      <div className="flex items-center gap-3 bg-muted/40 border rounded-xl p-2 w-fit max-w-full">
        
        {/* Image Preview */}
        {fileUrl && (
          <div className="relative group">
            <img
              src={fileUrl}
              alt="Preview"
              className="h-16 w-16 rounded-lg object-cover border"
            />

            {/* Remove Button (hidden → hover show) */}
            <button
              onClick={removeImage}
              className="
                absolute -top-2 -right-2
                bg-black/70 text-white
                rounded-full p-1
                opacity-0 group-hover:opacity-100
                transition
              "
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Uploading State */}
        {isUploading && (
          <div className="flex flex-col justify-center min-w-[120px]">
            
            {/* Text */}
            <p className="text-xs text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>

            {/* Progress Bar */}
            <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);
  }
);

export default FilePreview;