"use client"; // This is a client component 👈🏽
import React, { useState } from 'react';
import axios from 'axios';
import { run } from 'node:test';

interface OutfitItem {
  item: string;
  page_url: string;
  image_url: string;
}

const HomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setOutfitItems([]); // Clear previous results
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);

    try {
      const response = await axios.post('/api/process-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOutfitItems(response.data);
      setError(null);
    } catch (error) {
      setError('An error occurred while processing the image.');
      setOutfitItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Upload an Image to Get Outfit Suggestions</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      {previewUrl && (
        <div style={styles.imagePreviewContainer}>
          <img src={previewUrl} alt="Selected" style={styles.imagePreview} />
        </div>
      )}
      {outfitItems.length > 0 && (
        <div style={styles.resultContainer}>
          <h2>Suggested Outfits</h2>
          <div style={styles.gridContainer}>
            {outfitItems.map((item, index) => (
              <div key={index} style={styles.gridItem}>
                <a href={item.page_url} target="_blank" rel="noopener noreferrer">
                  <img src={item.image_url} alt={item.item} style={styles.gridImage} />
                </a>
                <p style={styles.itemName}>{item.item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center' as 'center',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
  input: {
    marginBottom: '10px',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  imagePreviewContainer: {
    marginTop: '20px',
    textAlign: 'center' as 'center',
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '5px',
  },
  resultContainer: {
    marginTop: '20px',
    textAlign: 'left' as 'left',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  gridImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover' as 'cover',
    borderRadius: '5px',
  },
  itemName: {
    marginTop: '5px',
    fontSize: '14px',
    textAlign: 'center' as 'center',
  },
};

export default HomePage;
// npm run dev
