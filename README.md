# **Image Optimizer with Pinata and React (Vite)**

This project is an **Image Optimizer** built with React (using Vite as the build tool) and integrated with **Pinata** for decentralized image upload and retrieval via **IPFS**. The app allows users to upload an image, customize dimensions, quality, and format, and then optimize and retrieve it through Pinata's IPFS gateway.

## **Features**
- Upload images to IPFS using Pinata.
- Customize image width, height, quality, and format (WebP, JPEG, PNG).
- Preview both the original and optimized versions of the image.
- Get the optimized image URL from Pinata's IPFS gateway.

## **Tech Stack**
- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Storage**: Pinata (IPFS)

## **Getting Started**

Follow the steps below to run the project locally:

### **Prerequisites**
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Pinata Account](https://www.pinata.cloud/) (for the API keys)

### **1. Clone the Repository**
```bash
git clone https://github.com/chintanonweb/pinata-image-optimizer.git
cd image-optimizer-pinata
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root of the project and add the following environment variables. Replace the placeholder values with your Pinata credentials:

```
VITE_PINATA_JWT=<your-pinata-jwt-token>
VITE_GATEWAY_URL=<your-pinata-gateway-url>
```

- **VITE_PINATA_JWT**: The JWT token from Pinata for authentication.
- **VITE_GATEWAY_URL**: Your custom Pinata gateway URL (e.g., `https://gateway.pinata.cloud`).

### **4. Run the Development Server**
Start the app locally using Vite's development server:
```bash
npm run dev
```

### **5. Build for Production**
If you want to build the app for production:
```bash
npm run build
```

### **6. Preview Production Build**
To preview the build:
```bash
npm run preview
```

## **Pinata Configuration**

Pinata is integrated using a custom **fetch API** for file uploads. Below is the relevant configuration used for interacting with the Pinata API in the app:

```typescript
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
```

This configuration uses:
- **Pinata File Upload**: Files are uploaded using the `pinFileToIPFS` endpoint.
- **JWT Authentication**: Replace `VITE_PINATA_JWT` in `.env` with your Pinata JWT token.
- **Pinata Gateway**: Your custom gateway URL is used to retrieve the optimized image.

## **How It Works**
1. **File Upload**: Users can select and upload an image file, which is pinned to IPFS via Pinata.
2. **Image Optimization**: The user can specify the width, height, quality (1-100), and format (WebP, JPEG, PNG).
3. **Image Preview**: Both the original image and the optimized version are previewed in the app.
4. **IPFS Hash and URL**: The image is stored in IPFS, and the optimized image is served via Pinata's IPFS gateway, with URL parameters controlling image properties.

## **Dependencies**
- **React**: JavaScript framework for building the user interface.
- **Vite**: Build tool for faster development.
- **Pinata API**: Used for uploading images and generating IPFS hashes.

## **License**
This project is licensed under the MIT License.