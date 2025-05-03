export const convertImageToBase64 = (file: File | null) => {
    if (!file) {
      return null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            const base64String = reader.result as string;
            resolve(base64String);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        }
    );
  };