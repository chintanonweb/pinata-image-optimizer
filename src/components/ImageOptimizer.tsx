import React, { useState, useEffect } from 'react';

const ImageOptimizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [optimizedUrl, setOptimizedUrl] = useState<string>('');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<string>('webp');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToPinata = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload to Pinata');
      }

      const data = await response.json();
      const ipfsHash = data.IpfsHash;
      
      // Construct the optimized URL
      const baseUrl = 'https://gateway.pinata.cloud';
      const optimizedUrl = `${baseUrl}/ipfs/${ipfsHash}?img-width=${width}&img-height=${height}&img-quality=${quality}&img-format=${format}`;
      
      setOptimizedUrl(optimizedUrl);
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      setError('Failed to upload the file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (optimizedUrl) {
      // Trigger a re-render of the optimized image when the URL changes
      const img = new Image();
      img.src = optimizedUrl;
    }
  }, [optimizedUrl]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side - Upload and Options */}
      <div className="w-1/2 p-8">
        <h1 className="text-3xl font-bold mb-6">Image Optimizer</h1>
        
        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Choose Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
              Width
            </label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter width"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter height"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
            Quality (1-100)
          </label>
          <input
            type="number"
            id="quality"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            min="1"
            max="100"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="webp">WebP</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </div>

        <button
          onClick={uploadToPinata}
          disabled={loading || !selectedFile}
          className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded ${
            loading || !selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload and Optimize'}
        </button>

        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}
      </div>

      {/* Right side - Preview */}
      <div className="w-1/2 p-8 bg-white">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        {previewUrl && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Original Image</h3>
            <img src={previewUrl} alt="Original" className="max-w-full h-auto" />
          </div>
        )}
        {optimizedUrl && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Optimized Image</h3>
            <img src={optimizedUrl} alt="Optimized" className="max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageOptimizer;