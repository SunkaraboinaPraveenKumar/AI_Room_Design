import { NextResponse } from "next/server";
import fetch from 'node-fetch';
import { Buffer } from 'buffer'; // Import Buffer for conversion

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds

// Function to fetch image from Hugging Face API
const fetchImage = async (prompt, retries = 0) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Log the response body
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Use arrayBuffer() instead of buffer()
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
  } catch (error) {
    if (retries < MAX_RETRIES) {
        // @ts-ignore
      console.warn(`Retrying due to error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS)); // Wait before retrying
      return fetchImage(prompt, retries + 1);
    } else {
      throw error; // Re-throw error after max retries
    }
  }
};

// Next.js API route handler
export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const imageBuffer = await fetchImage(prompt);

    // Return the image buffer as a response
    const response = new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg', // Ensure this matches the image type
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
