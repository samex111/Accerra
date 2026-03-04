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
      <div className="border-t bg-muted/50 px-3 py-2 sm:px-6 sm:py-3">
        <div className="flex items-center gap-3">
          {fileUrl && (
            <div className="relative">
              <img
                src={fileUrl}
                alt="Preview"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-md object-cover border"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {isUploading && (
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                Uploading {uploadProgress}%
              </p>
              <div className="h-2 w-full rounded bg-muted">
                <div
                  className="h-2 rounded bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default FilePreview;