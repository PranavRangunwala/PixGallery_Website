import React, { useState, useEffect } from 'react';

const FileDownloader = () => {
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        // Optionally, you could fetch the URL from Firebase storage here if needed
        const url = "https://firebasestorage.googleapis.com/v0/b/wallapper6969.appspot.com/o/images%2Fde23e30d-0025-4f92-85d6-53c289d72213?alt=media&token=6329b1f4-89df-45b1-b398-1268521ecf99";
        setFileUrl(url);
    }, []);

    return (
        <div>
            {fileUrl && (
                <a href={fileUrl} download="abc.jpeg">
                    Download
                </a>
            )}
        </div>
    );
};

export default FileDownloader;
