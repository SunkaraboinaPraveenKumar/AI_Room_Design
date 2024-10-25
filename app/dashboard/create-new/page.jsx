"use client"
import React, { useContext, useState } from 'react'
import ImageSelection from './_components/ImageSelection'
import RoomType from './_components/RoomType'
import DesignType from './_components/DesignType'
import AdditionalReq from './_components/AdditionalReq'
import { Button } from '@/components/ui/button'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { storage } from '@/config/firebase'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { db } from '@/config/db'
import { Users, AIGeneratedImage } from '@/config/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import Custom_Loader from './_components/Custom_Loader'
import AI_Output from '../_components/AI_Output'

function CreateNew() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const [outputResult, setOutputResult] = useState();
  const[openOutputDialog,setOpenOutputDialog]=useState(false);
  const [formData, setFormData] = useState({
    roomType: '',
    designType: '',
    additionalReq: '',
    image: ''  // Raw image from ImageSelection
  });

  const onHandleInputChange = (value, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const generatePrompt = () => {
    const { roomType, designType, additionalReq } = formData;

    let prompt = `Design a ${roomType} in a ${designType} style interior design.`;
    if (additionalReq) {
      prompt += ` Additional requirements: ${additionalReq}.`;
    }
    return prompt;
  };

  const GenerateDesign = async () => {
    if (userDetail?.credit <= 0) {
      notifyError("You don't have Enough Credits to Generate");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = generatePrompt();
    let DOWNLOAD_URL = '';
    let ORG_IMAGE_URL = '';

    try {
      // Upload raw image from ImageSelection and get its download URL
      ORG_IMAGE_URL = await uploadRawImage(formData.image);  // Raw image from user input

      // Generate image based on the AI prompt
      const imageResponse = await axios.post("/api/generate-image", {
        prompt: FINAL_PROMPT,
      }, { responseType: 'arraybuffer' });

      // Convert array buffer to base64 string
      const base64Image = Buffer.from(imageResponse.data).toString('base64');

      // Upload the AI-generated image to Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}_${formData?.roomType + formData?.designType + formData?.additionalReq}.jpg`);
      await uploadString(storageRef, base64Image, "base64", {
        contentType: "image/jpeg",
      });

      // Get the download URL of the uploaded AI image
      DOWNLOAD_URL = await getDownloadURL(storageRef);

      // Save image and metadata to the database
      await saveToDb(ORG_IMAGE_URL, DOWNLOAD_URL);  // Pass both AI and raw image URLs

      // Update user credits
      await updateUserCredits();

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };




  const uploadRawImage = async (base64Image) => {
    try {
      if (!base64Image.startsWith('data:image/')) {
        throw new Error('Invalid image format. Expected base64-encoded image.');
      }

      const storageRef = ref(storage, `raw-images/${Date.now()}_rawImage.jpg`);

      // Upload the base64 string image to Firebase Storage
      await uploadString(storageRef, base64Image, "data_url");

      // Get the download URL for the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      console.log("Raw image uploaded successfully:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading raw image:", error);
      throw error;
    }
  };


  // Save image and metadata to the database
  const saveToDb = async (orgImageUrl, aiImageUrl) => {
    try {
      const result = await db.insert(AIGeneratedImage).values({
        roomType: formData.roomType,
        designType: formData.designType,
        orgImage: orgImageUrl,  // Save the original (raw) image URL
        aiImage: aiImageUrl,   // Save the AI-generated image URL
        userEmail: user?.primaryEmailAddress?.emailAddress || null,  // Save user email
      }).returning({
        id: AIGeneratedImage.id,
        roomType: AIGeneratedImage.roomType,
        designType: AIGeneratedImage.designType,
        orgImage: AIGeneratedImage.orgImage,
        aiImage: AIGeneratedImage.aiImage,
        userEmail: AIGeneratedImage.userEmail,
      });

      console.log('Image data saved to DB:', result);
      setOutputResult(result[0]);
      setOpenOutputDialog(true);
    } catch (err) {
      console.error('Error saving to DB:', err);
    }
  };

  const updateUserCredits = async () => {
    await db.update(Users).set({
      credits: Number(userDetail?.credits - 1)
    })
      .where(eq(Users?.email, user?.primaryEmailAddress?.emailAddress))
      .returning({ id: Users.id });
  };

  return (
    <div className='m-5'>
      <h2 className='font-bold text-3xl text-primary text-center'>Experience the Magic of AI Modeling</h2>
      <p className='text-center text-gray-500'>
        Generate any room interior with a click and prompt. Select a space, choose a style and watch as AI instantly imagines the design of the interior.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-10 gap-10'>
        {/* Image Selection */}
        <ImageSelection selectedImage={(value) => onHandleInputChange(value, 'image')} />

        {/* Form Input Section */}
        <div>
          <RoomType selectedRoomType={(value) => onHandleInputChange(value, 'roomType')} />
          <DesignType selectedDesignType={(value) => onHandleInputChange(value, 'designType')} />
          <AdditionalReq additionalRequirementInput={(value) => onHandleInputChange(value, 'additionalReq')} />
          <Button onClick={() => GenerateDesign()} className='w-full mt-5'>Generate</Button>
          <p className='text-sm text-gray-400 mb-52 mt-5'>NOTE: 1 Credit will be used for each Generation of Interior Design</p>
        </div>
      </div>
      <Custom_Loader isLoading={loading} />
      <AI_Output outputResult={outputResult} openDialog={openOutputDialog} closeDialog={()=>setOpenOutputDialog(false)}/>
    </div>
  );
}

export default CreateNew;
