const API_URL = 'https://home-vision-ai.onrender.com/api/generate-design';

export async function generateDesign(data: {
  image: string | null;
  mood: string;
  budget: number;
  style: string;
  length: number;
  width: number;
  height: number;
}) {
  try {
    const formData = new FormData();
    
    // In a real app we would convert the base64 image to a File object
    // For this prototype, if it's a data URL, let's just send it as text 
    // or convert if necessary. A simple backend handles text perfectly fine for mocks.
    if (data.image) {
      // Mocking file upload: appending data URL string
      formData.append('image_data', data.image);
    }
    
    formData.append('mood', data.mood);
    formData.append('budget', data.budget.toString());
    formData.append('style', data.style);
    formData.append('length', data.length.toString());
    formData.append('width', data.width.toString());
    formData.append('height', data.height.toString());

    // Call our Node API
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Server error: ' + response.status);
    }
    
    const responseData = await response.json();
    return responseData;
    
  } catch (error: any) {
    if (error.message && error.message.includes('fetch')) {
      throw new Error('Cannot reach server. Please try again.');
    }
    throw error;
  }
}
